from flask import request, abort
import requests
from torrentUtils import TorrentUtils
from functools import reduce
from database import updateDb, updateDbByDict, deleteById, checkDataDb, User, db


# ^H в ключе - отправка заголовком
API_MAP = {
    'themoviedb': {'api_key': '6c60e65c45de8fc3495acac976c567ce'},
    'opensubtitles': {'Api-Key^H': '1xPMLpBzqrPAU893YsgmO65rDblq05Yd'}
}
# Параметры переданные вне контекста реквест, в основном используется для тестирования
PARAMS = {}


def getData(url, pointer=None):
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
    data = {'params': request.get_json() if request.get_data() else dict(request.args)} if context else PARAMS
    domain = findAPI(url)
    if domain in API_MAP:
        # Исполняем дополнительные инструкции для API, содержащегося в в карте
        # Например добавляем уникальный ключ в тело запроса/заголовки для этого ресурса
        for k in API_MAP[domain]:
            if '^H' in k:
                data.update({'headers': {k.split('^H')[0]: API_MAP[domain][k]}})
            else:
                data['params'].update({k: API_MAP[domain][k]})
    print(data)
    # Распаковываем и передаем в запрос все именнованные аргументы
    r = requests.get(url, **data)
    PARAMS = {}
    # Если прошел неуспешный запрос
    if r.status_code != requests.codes['ok']:
        return {'error': 1, 'message': 'Destination unreachable, maybe IP is blocked'}
    response = {
        'data':     getDataRecursive(r.json(), pointer) if pointer else r.json(),
        'error':    0,
        'message':  'Success'
    }
    return response


def findAPI(url):
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
    data = dict(request.json) if request.json else dict(request.args)
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
    data = dict(request.args)
    torrentHash = data['torrentHash']
    torrentPath = f'torrentFiles/{torrentHash}.torrent'
    torrentsList = TorrentUtils.getSavedTorrentFiles()
    if torrentPath not in torrentsList:
        abort(404, 'Torrent file not found')
    torrentHash = torrentHash.lower()
    TorrentUtils().stopTorrent(torrentHash)
    return {'message': 'Torrent stopped'}


def statusLoadMovie():
    data = dict(request.args)
    torrentHash = data['torrentHash']
    torrentPath = f'torrentFiles/{torrentHash}.torrent'
    torrentsList = TorrentUtils.getSavedTorrentFiles()
    if torrentPath not in torrentsList:
        abort(404, 'Torrent file not found')
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
    data = dict(request.args)
    userId = updateDbByDict(data, User, insert=True)
    return {'id': userId}


def getUser():
    data = dict(request.args)
    if 'login' not in data:
        return {'error': 1, 'message': 'Login must be filled'}
    login = data['login']
    try:
        user = User.query.filter_by(login=login).one()
    except:
        return {'error': 1, 'message': 'User not exist'}
    userInfo = {
        'error': 0,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email
    }
    return userInfo


def changeUser():
    data = dict(request.args)
    return {'message': 'Not authed'}


def checkLoginExist():
    data = dict(request.args)
    if 'login' not in data:
        return {'error': 1, 'message': 'Login must be filled'}
    login = data['login']
    user = checkDataDb(db.session.query(User).filter_by(login=login))
    return {'exist': True if user else False}


def checkEmailExist():
    data = dict(request.args)
    if 'email' not in data:
        return {'message': 'Email must be filled'}
    email = data['email']
    user = checkDataDb(db.session.query(User).filter_by(email=email))
    return {'exist': True if user else False}
