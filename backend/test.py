from torrentUtils import TorrentUtils
import api

# t = TorrentUtils()
# print(t.getTorrents())
# configs = t.client.call('core.get_config')
# print(t.getTorrents())
# for c in configs:
#     print(f'{c} - {configs[c]}')
api.PARAMS = {'params': {'imdb_id': 'tt0088247'}}

print(api.getSubtitles())

