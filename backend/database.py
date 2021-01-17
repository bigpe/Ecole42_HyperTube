from app import app

db = app.db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    login = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(64), index=True)
    firstName = db.Column(db.String(100))
    lastName = db.Column(db.String(100))


def updateDbByDict(dataDict, table, insert=False):
    if type(dataDict) != dict:
        dataDict = dict(dataDict)
    dataDict = emptyToNone(dataDict)
    if insert:
        table = table(**dataDict)
    else:
        for k, v in dataDict.items():
            setattr(table, k, v)
    return updateDb(table)


# Форматируем пустые строки в None, аналог Null
def emptyToNone(data):
    for k, v in data.items():
        if not v:
            data[k] = None
    return data


def deleteById(tableName, rowId):
    table = globals()[tableName]
    query = table.query.filter_by(id=rowId).delete(synchronize_session='fetch')
    return updateDb(query, True)


def updateDb(query, delete=False):
    if not delete:
        db.session.add(query)
    try:
        db.session.commit()
    except:
        db.session.rollback()
        db.session.close()
        return False
    return query.id if not delete else True


def checkDataDb(query):
    try:
        a = query.all()
    except:
        db.session.close()
        a = query.all()
    return a

db.create_all()



