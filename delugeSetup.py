from torrentUtils import TorrentUtils
import globalUtils
from pathlib import Path


baseDir = Path('app/downloads')
auth = "root:root:10"
globalUtils.saveFile(auth, 'auth', '~/.config/deluge/')

t = TorrentUtils()
t.client.call('core.set_config', {'max_active_downloading': -1})
t.client.call('core.set_config', {'max_active_limit': -1})
t.client.call('core.set_config', {'queue_new_to_top': True})
t.client.call('core.set_config', {'download_location': bytes(baseDir)})
