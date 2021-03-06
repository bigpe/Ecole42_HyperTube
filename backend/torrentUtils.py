from deluge_client import DelugeRPCClient
from torrentool.torrent import Torrent
from torrentool.exceptions import BencodeDecodingError
import requests
from typing import Union
from pathlib import Path
from shutil import which
import globalUtils


class TorrentUtils:
    client = None
    methods = []
    torrents = []

    def __init__(self, username='root', password='root', host='127.0.0.1', port=58846):
        self.checkDelugeExist()
        if username and password:
            self.client = DelugeRPCClient(host, port, username, password)
            try:
                self.client.connect()
            except ConnectionRefusedError:
                pass
            self.checkConnection()
            self.getMethods()
            self.getTorrents()

    def checkConnection(self):
        if not self.client or not self.client.connected:
            globalUtils.messageHandler('Torrent daemon not connected', tp='err')
            exit()

    @staticmethod
    def checkDelugeExist():
        if not which('deluge') or not which('deluged'):
            globalUtils.messageHandler('Deluge or Deluged daemon not installed', tp='err')
            exit()

    def getMethods(self) -> list:
        self.methods = self.client.call('daemon.get_method_list')
        return self.methods

    def getTorrents(self, fields: list = [], filters: dict = {}) -> list:
        self.torrents = self.client.call('core.get_torrents_status', filters, fields)
        return self.torrents

    def addTorrent(self, path: Union[str, Path]) -> Union[str, bool]:
        try:
            torrent = Torrent.from_file(path)
        except BencodeDecodingError:
            return False
        torrentId = torrent.info_hash
        if not self.checkTorrentExist(torrent.info_hash):
            fileEncoded = globalUtils.readFile(path)
            torrentId = self.client.call('core.add_torrent_file', '', fileEncoded, {
                'sequential_download': True,
                'prioritize_first_last': True})
            globalUtils.messageHandler(self.getTorrentName(path), '+ Download', tp='msg')
            return torrentId
        globalUtils.messageHandler(self.getTorrentName(path), 'Exist', tp='err')
        self.resumeTorrent(torrentId)
        return torrentId

    def stopTorrent(self, torrentHash: str):
        self.client.call('core.pause_torrent', [torrentHash])

    def resumeTorrent(self, torrentHash: str):
        self.client.call('core.resume_torrent', [torrentHash])

    def setTorrentOptions(self, torrentId: list, options: dict):
        self.client.call('core.set_torrent_options', [torrentId], options)

    def addPlugin(self, path: Union[str, Path]):
        fileEncoded = globalUtils.readFile(path)
        fileName = Path(path).name
        self.client.call('core.upload_plugin', fileName, fileEncoded)

    def checkTorrentExist(self, torrentHash):
        if type(torrentHash) != bytes:
            torrentHash = torrentHash.encode('UTF-8')
        return bool(torrentHash in self.torrents)

    @staticmethod
    def saveTorrentFile(torrentUrl, fileName):
        torrentData = requests.get(torrentUrl).content
        path = globalUtils.saveFile(torrentData, fileName, 'torrentFiles')
        return path

    @staticmethod
    def deleteTorrentFile(fileName):
        globalUtils.deleteFile(fileName, 'torrentFiles')

    @staticmethod
    def getTorrentName(torrent: Union[str, Path]):
        return Torrent.from_file(torrent).name

    @staticmethod
    def getSavedTorrentFiles():
        files = Path('torrentFiles').glob('*.torrent')
        filesList = []
        for f in files:
            filesList.append(str(f))
        return filesList
