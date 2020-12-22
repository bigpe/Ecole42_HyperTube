from torrentUtils import TorrentUtils

t = TorrentUtils()
print(t.getTorrents())
configs = t.client.call('core.get_config')
print(t.getTorrents())
for c in configs:
    print(f'{c} - {configs[c]}')

