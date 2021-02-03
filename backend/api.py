from flask import request, abort, session
import requests
from torrentUtils import TorrentUtils
from functools import reduce
from database import updateDb, updateDbByDict, deleteById, checkDataDb, User, db
from globalUtils import createHash
import sys


# ^H в ключе - отправка заголовком
API_MAP = {
    'themoviedb': {'api_key': '6c60e65c45de8fc3495acac976c567ce'},
    'opensubtitles': {'Api-Key^H': '1xPMLpBzqrPAU893YsgmO65rDblq05Yd'}
}
# Параметры переданные вне контекста реквест, в основном используется для тестирования
PARAMS = {}


def getData(url: str, pointer: list = None):
    # Унифицированный обработчик запросов, работает в контексте реквеста и без него
    # Траслирует все именованные аргументы в будущий запрос, так же можно передать указатель
    # для рекурсивного поиска по вложенному словарю, чтобы фильтровать начальную точку входа
    global PARAMS
    context = True
    try:
        request.get_data()
    except RuntimeError:  # Выставляем отрицательный флаг отсутсвия контекста,
        # если функция была вызвана в тестовом режиме
        context = False
    data = {'params': getParams(request)} if context else PARAMS
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
    r = requests.get(url, **data)
    PARAMS = {}
    # Если прошел неуспешный запрос
    if r.status_code != requests.codes['ok']:
        return createAnswer('Destination unreachable, maybe IP is blocked', True)
    return createAnswer('Success', False, {'data': getDataRecursive(r.json(), pointer) if pointer else r.json()})


def getParams(r: request):
    return r.get_json() if r.get_data() else dict(r.args)


# Обработчик backend ответов
def createAnswer(message: str, err: bool = False, additions: dict = None):
    answer = {'error': 1 if err else 0, 'message': message}
    if additions:  # Можно передать дополнительный словарь чтобы расширить стандартный ответ
        answer.update(additions)
    return answer


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


def startLoadMovie():
    data = getParams(request)
    torrentHash = data['torrentHash']
    torrentUrl = f'https://yts.mx/torrent/download/{torrentHash.upper()}'
    torrentPath = f'torrentFiles/{torrentHash}.torrent'
    torrentsList = TorrentUtils.getSavedTorrentFiles()
    if torrentPath not in torrentsList:
        torrentPath = saveTorrentFile(torrentUrl, torrentHash)
    t = TorrentUtils()
    t.addTorrent(torrentPath)
    torrentHash = torrentHash.lower()
    torrentObj = t.getTorrents(['save_path', 'files'], {'hash': torrentHash})[bytes(torrentHash.encode('utf-8'))]
    saveFolderPath = 'downloads'
    files = torrentObj[b'files']
    resDict = {'videoPath': None, 'subtitlesPath': None}
    for f in files:
        filePath = f"{saveFolderPath}/{f[b'path'].decode('utf-8')}"
        resDict = findMetaFiles(resDict, filePath)
    return resDict


def stopLoadMovie():
    data = getParams(request)
    torrentHash = data['torrentHash']
    torrentPath = f'torrentFiles/{torrentHash}.torrent'
    torrentsList = TorrentUtils.getSavedTorrentFiles()
    if torrentPath not in torrentsList:
        return createAnswer('Torrent file not found', True)
    torrentHash = torrentHash.lower()
    TorrentUtils().stopTorrent(torrentHash)
    return createAnswer('Torrent stopped')


def statusLoadMovie():
    data = getParams(request)
    torrentHash = data['torrentHash']
    torrentPath = f'torrentFiles/{torrentHash}.torrent'
    torrentsList = TorrentUtils.getSavedTorrentFiles()
    if torrentPath not in torrentsList:
        return createAnswer('Torrent file not found', True)
    t = TorrentUtils()
    torrentHash = torrentHash.lower()
    torrentObj = t.getTorrents(['progress'], {'hash': torrentHash})[bytes(torrentHash.encode('utf-8'))]
    resDict = {'progress': torrentObj[b'progress']}
    return resDict


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


def getDataRecursive(dataDict, mapList):
    return reduce(dict.get, mapList, dataDict)


def createUser():
    data = getParams(request)
    data['password'] = createHash(data['password'])
    userId = updateDbByDict(data, User, insert=True)
    return createAnswer('User created', False, {'id': userId}) if userId else createAnswer('User not created', True)


def getUser():
    data = getParams(request)
    fieldsToCheck = ['login']
    if checkAnswer := checkRequiredFields(fieldsToCheck, data): return checkAnswer
    login = data['login']
    user = User.query.filter_by(login=login).first()
    if not user:
        return createAnswer('User not Exist', True)
    userInfo = getUserInfo(user)
    return createAnswer('User Founded', False, userInfo)


def changeUser():
    data = getParams(request)
    if 'login' not in session:
        return createAnswer('Not Authed', True)
    login = session['login']
    if 'password' in data:
        data['password'] = createHash(data['password'])
    user = User.query.filter_by(login=login).first()
    updateDbByDict(data, user)
    return createAnswer('Info change successful')


def checkLoginExist():
    data = getParams(request)
    fieldsToCheck = ['login']
    if checkAnswer := checkRequiredFields(fieldsToCheck, data): return checkAnswer
    login = data['login']
    user = checkDataDb(db.session.query(User).filter_by(login=login))
    return createAnswer('Login exist') if user else createAnswer('Login vacant')


def checkEmailExist():
    data = getParams(request)
    fieldsToCheck = ['email']
    if checkAnswer := checkRequiredFields(fieldsToCheck, data): return checkAnswer
    email = data['email']
    user = checkDataDb(db.session.query(User).filter_by(email=email))
    return createAnswer('Email exist') if user else createAnswer('Email vacant')


def authUser():
    data = getParams(request)
    fieldsToCheck = ['login']
    if checkAnswer := checkRequiredFields(fieldsToCheck, data): return checkAnswer
    login = data['login']
    password = createHash(data['password'])
    user = User.query.filter_by(login=login, password=password).first()
    if user:
        session['login'] = login
    if not user:
        createAnswer('Login or password incorrect', True)
    userInfo = getUserInfo(user)
    return createAnswer('Authed', False, userInfo)


def logoutUser():
    if 'login' in session:
        del session['login']
    return createAnswer('Logout complete')


def checkAuth():
    return createAnswer('Authed') if 'login' in session else createAnswer('Not Authed', True)


def checkPassword():
    data = getParams(request)
    fieldsToCheck = ['login', 'password']
    if checkAnswer := checkRequiredFields(fieldsToCheck, data): return checkAnswer
    password = createHash(data['password'])
    login = session['login']
    user = User.query.filter_by(login=login, password=password).first()
    return createAnswer('Password correct') if user else createAnswer('Password Incorrect')


def getUserInfo(user: User) -> dict:
    userInfo = {
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email
    }
    return userInfo


def checkRequiredFields(fields: list, data: dict):
    notExistField = []
    for f in fields:
        if f not in data:
            notExistField.append(f)
    if notExistField:
        return createAnswer(f"{', '.join(notExistField)} must be filled", True)
    return False



