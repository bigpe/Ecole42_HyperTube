from torrentUtils import TorrentUtils
from pathlib import Path


def setupApp():
    auth = "root:root:10\n"
    authFile = Path().home().joinpath('.config/deluge/auth')
    with authFile.open('w') as f:
        f.write(auth)

    t = TorrentUtils()
    t.client.call('core.set_config', {'max_active_downloading': -1})
    t.client.call('core.set_config', {'max_active_limit': -1})
    t.client.call('core.set_config', {'queue_new_to_top': True})
    t.client.call('core.set_config', {'download_location': bytes('downloads'.encode('utf-8'))})
