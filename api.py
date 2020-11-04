from flask import request
import requests
from torrentUtils import TorrentUtils
from functools import reduce

API_MAP = {'themoviedb': {'api_key': '6c60e65c45de8fc3495acac976c567ce'}}
PARAMS = {}


def getData(url, pointer=None):
    global PARAMS
    context = True
    try:
        request.get_data()
    except RuntimeError:
        context = False
    data = {'params': request.get_json() if request.get_data() else dict(request.args)} if context else PARAMS
    domain = findAPI(url)
    if domain in API_MAP:
        data['params'].update(API_MAP[domain])
    r = requests.get(url, **data)
    PARAMS = {}
    return getDataRecursive(r.json(), pointer) if pointer else r.json()


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


def getMovie():
    url = f'https://yts.mx/api/v2/movie_details.json'
    return getData(url, ['data', 'movie'])


def getPerson(person_id):
    url = f'https://api.themoviedb.org/3/person/{person_id}'
    return getData(url)


# language <String>
def getGenres():
    url = f'https://api.themoviedb.org/3/genre/movie/list'
    return getData(url)


def saveTorrentsFile(torrents: list):
    for torrent in torrents:
        url = torrent['url']
        torrentHash = torrent['hash']
        fileName = f'{torrentHash}.torrent'
        path = TorrentUtils().saveTorrentFile(url, fileName)
        yield path


def getTorrents(movie: dict):
    torrents = movie['torrents']
    return torrents


def getDataRecursive(dataDict, mapList):
    return reduce(dict.get, mapList, dataDict)
