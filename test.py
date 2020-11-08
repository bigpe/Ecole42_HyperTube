from torrentUtils import TorrentUtils
import api
import globalUtils
from pathlib import Path


baseDir = Path(__file__).parent.absolute().joinpath('downloads')


torrent = TorrentUtils('root', 'root')
methods = TorrentUtils().getMethods()
for m in methods:
    print(m)

torrent.client.call('core.set_config', {'max_active_downloading': -1})
torrent.client.call('core.set_config', {'max_active_limit': -1})
torrent.client.call('core.set_config', {'queue_new_to_top': True})
torrent.client.call('core.set_config', {'queue_new_to_top': True})

torrent.client.call('core.set_config', {'download_location': bytes(baseDir)})

config = torrent.client.call('core.get_config')
for c in config:
    print(f'{c} - {config[c]}')

exit()

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


