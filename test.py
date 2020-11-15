from torrentUtils import TorrentUtils

t = TorrentUtils()
configs = t.client.call('core.get_config')
for c in configs:
    print(f'{c} - {configs[c]}')

