from flask import request, session, redirect
import requests
from torrentUtils import TorrentUtils
from database import updateDbByDict, deleteById, getOneByFields, getAllByFields, User, Movie, Subtitle, Commentary, \
    Token, UserWatchHistory
from globalUtils import createHash, getDataRecursive, saveFile, createDir
from typing import Union
from app import app
from werkzeug.utils import secure_filename
import re
from flask_mail import Message

API_MAP = app.config['API_MAP']


# Декоратор для передачи данных и файлов полученных из тела/аргуменов запроса
# А так же для проверки обязательных полей для заполнения, которые
# должны содержаться в теле/файлах запроса
# Для получения файлов из запроса необходимо передать files=True в функцию, декоратор вернет их вторым аргументом
def getParams(*fieldsToCheck, files=()):
    def checkFields(func=None):
        def findParams():
            params = findParamsFromRequest(request)
            if not params:
                params = {}
            if checkAnswer := validateFields(params):  # Прерываем выполнение запроса если любое
                # из полей содержащихся в теле не прошло валидацию
                return checkAnswer
            if fieldsToCheck:  # Прерываем выполнение запроса если любое
                # из обязательных полей переданных в декоратор
                # не было найдено в теле/аргументах/файлах запроса
                if checkAnswer := checkRequiredFields(fieldsToCheck, params=params, files=request.files):
                    return checkAnswer
            if files:
                return func(params, request.files) if func else params
            return func(params) if func else params

        return findParams

    return checkFields


# Валидатор полей для аргументов, переданных в запросе
def validateFields(params):
    validator = {
        'password': {'r': r'[\w|\d]+[!@#$%^&*]+', 'ml': 8, 'mx': 30},
        'login': {'r': r'[\w|\d]', 'ml': 5, 'mx': 30},
        'email': {'r': r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', 'ml': 8, 'mx': 30},
        'firstName': {'r': r'^[A-zА-я]+$', 'ml': 3, 'mx': 30},
        'lastName': {'r': r'^[A-zА-я]+$', 'ml': 3, 'mx': 30},
    }
    fieldsNotValidated = []
    for p in params:
        if p not in validator:
            continue
        if not re.match(validator[p]['r'], params[p]):
            fieldsNotValidated.append(p)
            continue
        if len(params[p]) < validator[p]['ml']:
            fieldsNotValidated.append(p)
            continue
        if len(params[p]) > validator[p]['mx']:
            fieldsNotValidated.append(p)
            continue
    if fieldsNotValidated:
        return createAnswer(f"{', '.join(fieldsNotValidated)} not validated", err=True)
    return False


def findParamsFromRequest(r: request):
    params = {}
    try:
        if r.args:
            params.update(r.args)
        if r.form:
            params.update(r.form)
        try:
            if j := r.get_json():
                params.update(j)
        except:
            pass
    except:
        pass
    return params


# Исполняем дополнительные инструкции для API, содержащегося в карте
# Например добавляем уникальный ключ в тело запроса/заголовки для этого ресурса
# ^H обновить заголвок (headers)
# ^P обновить параметры запроса (params)
# ^D обновить тело запроса (data)
# ^J передать в теле запроса как json (json)
def updateParams(params, domain):
    for k in API_MAP[domain]:
        if '^H' in k:
            updateParamType(params, 'headers', k, domain)
        if '^P' in k:
            updateParamType(params, 'params', k, domain)
        if '^D' in k:
            updateParamType(params, 'data', k, domain)
        if '^J' in k:
            updateParamType(params, 'json', k, domain)
    return params


def updateParamType(params, paramType, key, domain):
    if paramType not in params:
        params[paramType] = {}
    paramsChar = f'^{paramType[0].upper()}'
    params[paramType].update({key.split(paramsChar)[0]: API_MAP[domain][key]})
    return params


# Унифицированный обработчик запросов, работает в контексте реквеста и без него, при передаче body
# Траслирует все именованные аргументы в будущий запрос, так же можно передать указатель
# для рекурсивного поиска по вложенному словарю, чтобы фильтровать начальную точку входа
def getData(url: str, pointer: list = None, method='get', body=None) -> dict:
    @getParams()
    def getDataWithParams(params):
        data = body if body else {'params': params}
        domain = findAPI(url)
        if domain in API_MAP:
            data = updateParams(data, domain)
        # Распаковываем и передаем в запрос все именнованные аргументы
        r = getattr(requests, method.lower())(url, **data)
        # Пытаемся получить JSON ответ, для последующего рекурсивного поиска по нему
        try:
            responseData = r.json()
        # Либо получаем обычный текст ответа
        except:
            responseData = r.text
        # Если прошел неуспешный запрос
        if r.status_code != requests.codes['ok']:
            return createAnswer(f'Request failed', True, {
                'status_code': r.status_code,
                'server_answer': responseData
            })
        return createAnswer('Success', False, {
            'data': getDataRecursive(responseData, pointer) if pointer else responseData
        })

    return getDataWithParams()


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
    user = getUserByFields(login=session['login'])
    moviesMap = {}
    for i, movie in enumerate(data['data']):
        moviesMap.update({movie['imdb_code']: i})
    watchedMovies = getAllByFields(UserWatchHistory, user_id=user.id)
    if watchedMovies:
        for watchedMovie in watchedMovies:
            movie_imdb_id = watchedMovie.movie_imdb_id
            if movie_imdb_id in moviesMap:
                movieIndex = moviesMap[movie_imdb_id]
                data['data'][movieIndex]['watched'] = True
    return data


def getMovie():
    url = f'https://yts.mx/api/v2/movie_details.json'
    movieInfo = getData(url, ['data', 'movie'])
    IMDBid = getDataRecursive(movieInfo['data'], ['imdb_code'])
    createMovie(IMDBid)
    return movieInfo


def createMovie(IMDBid):
    movieId = updateDbByDict({'imdb_id': IMDBid}, Movie, insert=True)
    if not movieId:
        return movieId
    movie = getOneByFields(Movie, id=movieId)
    user = getUserByFields(login=session['login'])
    try:
        updateDbByDict({'user_id': user.id, 'movie_imdb_id': IMDBid}, UserWatchHistory, insert=True)
    except:
        pass
    if movie:
        updateDbByDict({'watch_count': movie.watch_count + 1}, movie)
    return movieId


def getSubtitles(body=None):
    url = 'https://www.opensubtitles.com/api/v1/subtitles'
    if body:
        data = getData(url, ['data', 0, 'attributes', 'files', 0], body=body)
    else:
        data = getData(url, ['data', 0, 'attributes', 'files', 0])
    return data


@getParams('IMDBid')
def getMovieSubtitles(params):
    IMDBid = params['IMDBid']
    createMovie(IMDBid)
    subtitles = []
    languages = {'en', 'ru', 'fr'}
    for language in languages:
        subtitleDB = getOneByFields(Subtitle, language=language, movie_imdb_id=IMDBid)
        if subtitleDB:
            subtitles.append({language: f'/{subtitleDB.path}'})
            continue
        subtitleObj = getSubtitles({'params': {'imdb_id': IMDBid, 'languages': language}})['data']
        if not subtitleObj:
            continue
        subtitlePath = saveSubtitles(subtitleObj, language, IMDBid)
        if subtitlePath:
            subtitles.append(subtitlePath)
    return createAnswer('data', False, {'subtitlesPath': subtitles})


def saveSubtitles(subtitleObj, language, IMDBid):
    url = 'https://www.opensubtitles.com/api/v1/download'
    fileId = subtitleObj['file_id']
    fileName = subtitleObj['file_name']
    subtitle = getData(url, body={'params': {'file_id': fileId, 'file_name': fileName}}, method='POST')
    if subtitle['error']:
        return {}
    subtitle = subtitle['data']
    if 'link' not in subtitle:
        return {}
    subtitleFile = requests.get(subtitle['link']).content
    createDir('subtitles')
    createDir(f'subtitles/{IMDBid}')
    subtitleFilePath = saveFile(subtitleFile, secure_filename(fileName), f'subtitles/{IMDBid}')
    updateDbByDict({'movie_imdb_id': IMDBid, 'language': language, 'path': subtitleFilePath}, Subtitle, insert=True)
    return {language: f'/{subtitleFilePath}'}


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
    metaPath = {'videoPath': None}
    for f in files:
        filePath = f"{saveFolderPath}/{f[b'path'].decode('utf-8')}"
        metaPath = findMetaFiles(metaPath, filePath)
    return createAnswer('Movie Start Loading', additions=metaPath)


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
    email = params['email']
    userId = updateDbByDict(params, User, insert=True)
    if userId:
        try:
            sendMail(email, 'HyperTube Project | Welcome',
                     '<h2>Welcome to HyperTube</h2><br>'
                     '<p>Your account successful created</p>'
                     '<p>Enjoy to watch movies!</p>')
        except:
            pass
        return createAnswer('User created', False, {'id': userId})
    return createAnswer('User not created', True)


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
    if answer := checkAuthed():
        return answer
    for f in files:
        fileName = secure_filename(files[f].filename)
        createDir('media')
        savePath = f'media/{fileName}'
        files[f].save(savePath)
        params.update({f: f'/{savePath}'})
    login = session['login']
    if 'password' in params:
        params['password'] = createHash(params['password'])
    user = getUserByFields(login=login)
    if not user:
        return createAnswer('User not Exist', True)
    updateDbByDict(params, user)
    if 'login' in params:
        session['login'] = params['login']
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
    if 'restore' in session:
        del session['restore']
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


@getParams('commentary', 'IMDBid')
def createCommentary(params) -> dict:
    commentary = params['commentary']
    IMDBid = params['IMDBid']
    movie = getOneByFields(Movie, imdb_id=IMDBid)
    if not movie:
        return createAnswer('Movie not found', True)
    if answer := checkAuthed():
        return answer
    if answer := checkLoginNotNull():
        return answer
    user = getUserByFields(login=session['login'])
    commentary_id = updateDbByDict(
        {'commentary': commentary,
         'user_id': user.id,
         'movie_imdb_id': movie.imdb_id},
        Commentary, insert=True)
    return createAnswer('Commentary created',
                        additions={'id': commentary_id}) if commentary_id else createAnswer('Commentary not created')


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


@getParams('IMDBid')
def getMovieCommentaries(params) -> dict:
    IMDBid = params['IMDBid']
    commentariesList = []
    commentaries = getAllByFields(Commentary, movie_imdb_id=IMDBid)
    for commentary in commentaries:
        user = commentary.user
        commentariesList.append({
            'id': commentary.id,
            'commentary': commentary.commentary,
            'login': user.login,
            'user_id': user.id
        })
    return createAnswer(f'Commentaries for movie {IMDBid}', False, {'data': commentariesList})


@getParams('id_token')
def authUserGoogle(params):
    token = params['id_token']
    url = f'https://www.googleapis.com/oauth2/v3/tokeninfo'
    googleUserInfo = getData(url)
    if not googleUserInfo['error']:
        googleUserInfo = googleUserInfo['data']
    else:
        return createAnswer('Auth failed', err=True)
    updateDbByDict({
        'firstName': googleUserInfo['given_name'],
        'lastName': googleUserInfo['family_name'],
        'email': googleUserInfo['email'],
        'userPhoto': googleUserInfo['picture'],
        'login': googleUserInfo['sub']
    }, User, insert=True)
    user = getOneByFields(User, login=googleUserInfo['sub'])
    if user:
        session['login'] = googleUserInfo['sub']
    else:
        user = getOneByFields(User, email=googleUserInfo['email'])
        session['login'] = user.login
    return getUserInfo(user)


@getParams('email')
def resetPassword(params):
    email = params['email']
    user = getOneByFields(User, email=email)
    if not user:
        return createAnswer('User with this email not exist', err=True)
    token = createHash(email, timeSalt=True)
    tokenObj = getOneByFields(Token, user_id=user.id)
    if tokenObj:
        tokenId = updateDbByDict({'token': token, 'user_id': user.id}, tokenObj)
    else:
        tokenId = updateDbByDict({'token': token, 'user_id': user.id}, Token, insert=True)
    if not tokenId:
        return createAnswer('Something went wrong, sorry', err=True)
    try:
        sendMail(email, 'HyperTube Project | Password Reset', '<h2>Recovery your password</h2><br>'
                                                              f'<a href="{request.host_url}user/reset/verify/?token={token}">Verify Link</a><br><br>'
                                                              f'<b>Please verify your email by the link</b>')
    except:
        return createAnswer('Messages send blocked (spam policy)', err=True)
    return createAnswer('Verify link successful sent')


@getParams('token')
def verifyReset(params):
    verifyToken = params['token']
    token = getOneByFields(Token, token=verifyToken)
    if token:
        session['reset'] = True
        session['login'] = token.user.login
        deleteById('Token', token.id)
        redirect('/restore')
    return redirect('/')


def checkResetUser():
    if 'reset' in session:
        return createAnswer('User in reset stage')
    return createAnswer('User not in reset stage', err=True)


def sendMail(recipient, subject, msgBody):
    msg = Message(subject, recipients=[recipient])
    msg.html = msgBody
    app.mail.send(msg)


def checkAuthed() -> Union[bool, dict]:
    if 'login' not in session or 'restore' in session:
        return createAnswer('Not Authed', True)
    if 'login' in session:
        if not getUserByFields(login=session['login']):
            return createAnswer('Not Authed', True)
    return False


def checkLoginNotNull() -> Union[bool, dict]:
    if not session['login']:
        return createAnswer('Login must be not empty', True)
    return False
