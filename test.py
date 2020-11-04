from torrentUtils import TorrentUtils
import api
import globalUtils

torrent = TorrentUtils('root', 'root')

api.PARAMS = {'params': {'limit': 5, 'query_term': 'Black Panther'}}
movies = api.getMovies()
globalUtils.copyToClipboard(movies)
for movie in movies:
    torrents = api.getTorrents(movie)
    torrentFiles = api.saveTorrentsFile(torrents)
    for t in torrentFiles:
        torrent.addTorrent(t)

exit()


torrents = TorrentUtils.getSavedTorrentFiles()
for t in torrents:
    print(TorrentUtils.getTorrentName(t))


