from torrentUtils import TorrentUtils
from pathlib import Path


baseDir = Path(__file__).parent.absolute().joinpath('downloads')


t = TorrentUtils()
t.client.call('core.set_config', {'max_active_downloading': -1})
t.client.call('core.set_config', {'max_active_limit': -1})
t.client.call('core.set_config', {'queue_new_to_top': True})
t.client.call('core.set_config', {'download_location': bytes(baseDir)})
