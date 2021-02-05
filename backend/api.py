from flask import request, session
import requests
from torrentUtils import TorrentUtils
from database import updateDbByDict, deleteById, getOneByFields, User, db
from globalUtils import createHash, getDataRecursive
import sys
from typing import Union
from app import app
from werkzeug.utils import secure_filename

API_MAP = app.config['API_MAP']
# Параметры переданные вне контекста реквест, в основном используется для тестирования
PARAMS = {}


# Декоратор для передачи данных полученных из тела запроса/аргуменов запроса
# А так же для проверки обязательных полей для заполнения, которые
# должны содержаться в теле запроса
def getParams(*fieldsToCheck, files=()):
    def checkFields(func=None):
        def findParams():
            params = findParamsFromRequest(request)
            if not params:
                params = {}
            if fieldsToCheck:  # Прерываем выполнение запроса если любое
                # из обязательных полей переданных в декоратор
                # не было найдено в теле/аргументах запроса
                if checkAnswer := checkRequiredFields(fieldsToCheck, params=params, files=request.files):
                    return checkAnswer
            if files:
                return func(params, request.files) if func else params
            return func(params) if func else params
        return findParams
    return checkFields


def findParamsFromRequest(r: request):
    params = r.get_json() if r.get_data() else dict(r.args)
    return params


# Унифицированный обработчик запросов, работает в контексте реквеста и без него
# Траслирует все именованные аргументы в будущий запрос, так же можно передать указатель
# для рекурсивного поиска по вложенному словарю, чтобы фильтровать начальную точку входа
def getData(url: str, pointer: list = None, method='get', body=None) -> dict:
    global PARAMS
    context = True
    try:
        request.get_data()
    except RuntimeError:  # Выставляем отрицательный флаг отсутсвия контекста,
        # если функция была вызвана в тестовом режиме
        context = False
    data = body if body else {'params': findParamsFromRequest(request)} if context else PARAMS
    domain = findAPI(url)
    if domain in API_MAP:
        # Исполняем дополнительные инструкции для API, содержащегося в карте
        # Например добавляем уникальный ключ в тело запроса/заголовки для этого ресурса
        for k in API_MAP[domain]:
            if '^H' in k:
                data['headers'].update({k.split('^H')[0]: API_MAP[domain][k]})
            else:
                data['params'].update({k: API_MAP[domain][k]})
    # Распаковываем и передаем в запрос все именнованные аргументы
    r = getattr(requests, method.lower())(url, **data)
    PARAMS = {}
    # Если прошел неуспешный запрос
    if r.status_code != requests.codes['ok']:
        return createAnswer('Destination unreachable, maybe IP is blocked', True)
    return createAnswer('Success', False, {'data': getDataRecursive(r.json(), pointer) if pointer else r.json()})


# Обработчик backend ответов
def createAnswer(message: str, err: bool = False, additions: dict = None):
    answer = {'error': 1 if err else 0, 'message': message}
    if additions:  # Можно передать дополнительный словарь чтобы расширить стандартный ответ
        answer.update(additions)
    return answer


# Поиск доменного имени API к которому идет запрос, для использования в виде ключа к API_MAP
def findAPI(url: str):
    cleanUrl = url.split('//')[1].split('/')[0]
    zone = cleanUrl.split('.')[-1]
    domain = cleanUrl.split(f'.{zone}')[0]
    finalDomain = domain if '.' not in domain else domain.split('.')[1]
    return finalDomain


def getMovies():
    url = f'https://yts.mx/api/v2/list_movies.json'
    data = getData(url, ['data', 'movies'])
    return data


def getSubtitles():
    url = 'https://www.opensubtitles.com/api/v1/subtitles'
    data = getData(url, ['data'])
    return data


def getMovie():
    url = f'https://yts.mx/api/v2/movie_details.json'
    return getData(url, ['data', 'movie'])


def getPerson(person_id):
    url = f'https://api.themoviedb.org/3/person/{person_id}'
    return getData(url)


def getGenres():
    url = f'https://api.themoviedb.org/3/genre/movie/list'
    return getData(url, ['genres'])


def saveTorrentsFileByTorrentList(torrents: list):
    for torrent in torrents:
        torrentUrl = torrent['url']
        torrentHash = torrent['hash']
        path = saveTorrentFile(torrentUrl, torrentHash)
        yield path


def saveTorrentFile(torrentUrl, torrentHash):
    fileName = f'{torrentHash}.torrent'
    path = TorrentUtils().saveTorrentFile(torrentUrl, fileName)
    return path


def deleteTorrentFile(torrentHash):
    fileName = f'{torrentHash}.torrent'
    TorrentUtils().deleteTorrentFile(fileName)


@getParams('torrentHash')
def startLoadMovie(params) -> dict:
    torrentHash = params['torrentHash']
    torrentUrl = f'https://yts.mx/torrent/download/{torrentHash.upper()}'
    torrentPath = f'torrentFiles/{torrentHash}.torrent'
    torrentsList = TorrentUtils.getSavedTorrentFiles()
    if torrentPath not in torrentsList:
        torrentPath = saveTorrentFile(torrentUrl, torrentHash)
    t = TorrentUtils()
    if not t.addTorrent(torrentPath):
        deleteTorrentFile(torrentHash)
        return createAnswer('Failed to add torrent', True)
    torrentHash = torrentHash.lower()
    torrentObj = t.getTorrents(['save_path', 'files'], {'hash': torrentHash})[bytes(torrentHash.encode('utf-8'))]
    saveFolderPath = 'downloads'
    files = torrentObj[b'files']
    metaPath = {'videoPath': None, 'subtitlesPath': None}
    for f in files:
        filePath = f"{saveFolderPath}/{f[b'path'].decode('utf-8')}"
        metaPath = findMetaFiles(metaPath, filePath)
    return createAnswer('Movie Start Loading', False, metaPath)


@getParams('torrentHash')
def stopLoadMovie(params) -> dict:
    torrentHash = params['torrentHash']
    torrentPath = f'torrentFiles/{torrentHash}.torrent'
    torrentsList = TorrentUtils.getSavedTorrentFiles()
    if torrentPath not in torrentsList:
        return createAnswer('Torrent file not found', True)
    torrentHash = torrentHash.lower()
    TorrentUtils().stopTorrent(torrentHash)
    return createAnswer('Torrent stopped')


@getParams('torrentHash')
def statusLoadMovie(params):
    torrentHash = params['torrentHash']
    torrentPath = f'torrentFiles/{torrentHash}.torrent'
    torrentsList = TorrentUtils.getSavedTorrentFiles()
    if torrentPath not in torrentsList:
        return createAnswer('Torrent file not found', True)
    t = TorrentUtils()
    torrentHash = torrentHash.lower()
    torrentObj = t.getTorrents(['progress'], {'hash': torrentHash})[bytes(torrentHash.encode('utf-8'))]
    return createAnswer('Success', False, {'progress': torrentObj[b'progress']})


def findMetaFiles(resDict, filePath):
    if findVideo(filePath):
        resDict.update({'videoPath': filePath})
    if findSubtitles(filePath):
        resDict.update({'subtitlesPath': filePath})
    return resDict


def findVideo(filePath):
    formats = {'mp4', 'avi'}
    ext = filePath.split('.')[-1].lower()
    if ext in formats:
        return True
    return False


def findSubtitles(filePath):
    formats = {'srt'}
    ext = filePath.split('.')[-1].lower()
    if ext in formats:
        return True
    return False


def getTorrentsByMovieList(movie: dict):
    torrents = movie['torrents']
    return torrents


@getParams('login', 'firstName', 'lastName', 'email', 'password')
def createUser(params) -> dict:
    params['password'] = createHash(params['password'])
    userId = updateDbByDict(params, User, insert=True)
    return createAnswer('User created', False, {'id': userId}) if userId else createAnswer('User not created', True)


@getParams('login')
def getUser(params) -> dict:
    login = params['login']
    user = getUserByFields(login=login)
    if not user:
        return createAnswer('User not Exist', True)
    userInfo = getUserInfo(user)
    return createAnswer('User Founded', False, userInfo)


@getParams(files=True)
def changeUser(params: dict, files: dict) -> dict:
    for f in files:
        fileName = secure_filename(files[f].filename)
        savePath = f'media/{fileName}'
        files[f].save(savePath)
        params.update({f: savePath})
    if answer := checkAuthed():
        return answer
    login = session['login']
    if 'password' in params:
        params['password'] = createHash(params['password'])
    user = getUserByFields(login=login)
    if not user:
        return createAnswer('User not Exist', True)
    updateDbByDict(params, user)
    return createAnswer('Info change successful')


@getParams('login')
def checkLoginExist(params) -> dict:
    login = params['login']
    user = getUserByFields(login=login)
    return createAnswer('Login exist') if user else createAnswer('Login vacant')


@getParams('email')
def checkEmailExist(params) -> dict:
    email = params['email']
    user = getUserByFields(email=email)
    return createAnswer('Email exist') if user else createAnswer('Email vacant')


@getParams('login', 'password')
def authUser(params) -> dict:
    login = params['login']
    password = createHash(params['password'])
    user = getUserByFields(login=login, password=password)
    if not user:
        return createAnswer('Login or password incorrect', True)
    session['login'] = login
    userInfo = getUserInfo(user)
    return createAnswer('Authed', False, userInfo)


def logoutUser() -> dict:
    if answer := checkAuthed():
        return answer
    del session['login']
    return createAnswer('Logout complete')


def checkAuth() -> dict:
    if answer := checkAuthed():
        return answer
    login = session['login']
    user = getUserByFields(login=login)
    userInfo = getUserInfo(user)
    return createAnswer('Authed', False, userInfo)


@getParams('password')
def checkPassword(params) -> dict:
    if answer := checkAuthed():
        return answer
    password = createHash(params['password'])
    login = session['login']
    user = getUserByFields(login=login, password=password)
    return createAnswer('Password correct') if user else createAnswer('Password Incorrect')


def createCommentary():
    ...


def getUserInfo(user: User) -> dict:
    userInfo = {
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email,
        'login': user.login,
        'userPhoto': user.userPhoto
    }
    return userInfo


def checkRequiredFields(fields, params: dict, files) -> Union[dict, bool]:
    notExistField = []
    for f in fields:
        if f not in params and f not in files:
            notExistField.append(f)
    if notExistField:
        return createAnswer(f"{', '.join(notExistField)} must be filled", True)
    return False


def getUserByFields(**fields) -> User:
    user = getOneByFields(User, **fields)
    return user


def getCommentariesByMovieIMDBid(IMDBid):
    ...


def updateWatchStatisticByMovieIMDBid(IMDBid):
    ...


@getParams('code')
def authUser42(params):
    code = params['code']
    params = {'grant_type': 'client_credentials',
              'client_id': 'db5cd84b784b4c4998f4131c353ef1828345aa1ce5ed3b6ebac9f7e4080be068',
              'client_secret': '8f57b290400dea66eb8f52ca7f189fef0b58f296bfbf4b889c059090e0bee7bc',
              'code': code
              }
    token = getData('https://api.intra.42.fr/oauth/token',
                    method='POST', body={'data': params})['data']['access_token']
    return getData(f'https://api.intra.42.fr/v2/me',
                   body={'headers': {'Authorization': f'Bearer {token}'}})


def checkAuthed():
    if 'login' not in session:
        return createAnswer('Not Authed', True)
    return False

