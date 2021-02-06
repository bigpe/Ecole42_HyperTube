import json
import pyperclip
from colorama import Fore, Style
from datetime import datetime
from typing import Union
from pathlib import Path
import base64
import sys
from hashlib import sha256
from functools import reduce

MessageLimitLen = 100


def messageHandler(element, prefix=None, postfix=None, tp="msg", xPos=1, yPos=1):
    tps = {"msg": Fore.GREEN, "err": Fore.RED, "ttl": Fore.BLUE, "data": Fore.YELLOW}
    if element and tp == "err":  # Cut Message If Bigger then limit
        if type(element) == str:
            if len(element) > MessageLimitLen:
                f = open("log.txt", "w")
                f.write(element)
                element = element[:MessageLimitLen]
                messageHandler("Message too long, to see full result open log.txt", tp="err")
    if type(element) == list:
        element = f"[{' => '.join(map(str, element))}]"  # Convert Int to Str && Array to Str
    result = []
    if prefix:
        result.append(f"{tps[tp]}{prefix}{Style.RESET_ALL}")
    if not prefix and not postfix:
        result.append(f"{tps[tp]}{Style.BRIGHT}{element}{Style.RESET_ALL}")
    else:
        result.append(f"{Fore.MAGENTA}{Style.BRIGHT}{element}{Style.RESET_ALL}")
    if postfix:
        result.append(f"{tps[tp]}{postfix}{Style.RESET_ALL}")
    xPosS = []
    for p in range(xPos-1):
        xPosS.append("\t*")
    yPosS = []
    for p in range(yPos-1):
        yPosS.append("\n")
    result = " ".join(result)
    if tp == "err" or tp == "ttl" or tp == "msg":
        result = f"{Fore.CYAN}{Style.BRIGHT}[{datetime.now().strftime('%H:%M')}]{Style.RESET_ALL} " + result
    result = "".join(yPosS) + "".join(xPosS) + result
    print(result, file=sys.stderr)


def copyToClipboard(data: Union[dict, list, str]):
    allowedToCopy = {dict, list, str}
    if data:
        if type(data) == dict or type(data) == list:
            data = json.dumps(data)  # Dump to Json String if Dict || List Detected
        if type(data) in allowedToCopy:
            pyperclip.copy(data)
            messageHandler("Copied to Clipboard\n", tp="msg")
        else:
            messageHandler(type(data), "This data type", "unsupported to copy", tp="err")
    else:
        messageHandler("Not copied data is empty\n", tp="err")


def readFile(path: Union[str, Path]) -> base64:
    with open(path, 'rb') as f:
        fileEncode = base64.b64encode(f.read())
    return fileEncode


def saveFile(fileData, fileName, directory: [str, Path] = '.'):
    if directory.replace('.', ''):
        Path(f'{directory}').mkdir(exist_ok=True)
    with open(f'{directory}/{fileName}', 'wb') as f:
        f.write(fileData)
        return f.name


def deleteFile(fileName, directory: [str, Path] = '.'):
    if directory.replace('.', ''):
        Path(f'{directory}').mkdir(exist_ok=True)
    Path(f'{directory}/{fileName}').unlink(missing_ok=True)


def addressInit():
    data = {}
    if len(sys.argv) > 1:
        temp = sys.argv[1].split(':')
        data.update({'host': temp[0], 'port': int(temp[1])})
    return data


# Создание sha256 хэша строки
def createHash(hashString: str) -> str:
    return sha256(hashString.encode('UTF-8')).hexdigest()


# Рекурсивный поиск по словарю/массиву, для возврата вложенных значений,
# рекурсивный путь описывается массивом
def getDataRecursive(data: Union[dict, list], mapList: list):
    newData = data
    newMapList = mapList
    if not newMapList:
        return newData
    if type(data) == dict:
        newData, newMapList = getRecursiveDict(data, mapList)
    if type(data) == list:
        newData, newMapList = getRecursiveList(data, mapList)
    if newData == data and newMapList == mapList:
        return []
    return getDataRecursive(newData, newMapList)


def getRecursiveDict(data: dict, mapList: list):
    newMapList = []
    tempMapList = mapList
    for i, m in enumerate(mapList):
        if type(m) == int:
            break
        newMapList.append(m)
        tempMapList.pop(i)
    newData = reduce(dict.get, newMapList, data)
    if not newData:
        newData = []
    return newData, tempMapList


def getRecursiveList(data, mapList):
    newMapList = []
    tempMapList = mapList
    for i, m in enumerate(mapList):
        if type(m) != int:
            break
        newMapList.append(m)
        tempMapList.pop(i)
    for m in newMapList:
        try:
            data = data[m]
        except IndexError:
            return [], None
    return data, tempMapList

