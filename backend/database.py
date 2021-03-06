from app import app
from sqlalchemy import func

db = app.db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    login = db.Column(db.String(30), unique=True, nullable=True)
    email = db.Column(db.String(30), unique=True, nullable=True)
    password = db.Column(db.String(64), index=True, nullable=True)
    firstName = db.Column(db.String(100), nullable=True)
    lastName = db.Column(db.String(100), nullable=True)
    userPhoto = db.Column(db.String(200), nullable=True)


class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    imdb_id = db.Column(db.String(50), nullable=False, unique=True)
    watch_count = db.Column(db.Integer, default=0)
    last_watch_date = db.Column(db.TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp())


class Subtitle(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    movie_imdb_id = db.Column(db.String(50), db.ForeignKey('movie.imdb_id'))
    language = db.Column(db.String(5), nullable=False)
    path = db.Column(db.String(200), nullable=False)

    __table_args__ = (
        db.UniqueConstraint('movie_imdb_id', 'language'),
    )


class Commentary(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    movie_imdb_id = db.Column(db.String(50), db.ForeignKey('movie.imdb_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='author', lazy='joined', uselist=False)
    commentary = db.Column(db.String(255), nullable=False)


class Token(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='owner', lazy='joined', uselist=False)
    token = db.Column(db.String(50), nullable=False)


class UserWatchHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    movie_imdb_id = db.Column(db.String(50), db.ForeignKey('movie.imdb_id'))

    __table_args__ = (
        db.UniqueConstraint('movie_imdb_id', 'user_id'),
    )


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


def getOneByFields(table, **fields):
    return table.query.filter_by(**fields).first()


def getAllByFields(table, **fields):
    return table.query.filter_by(**fields).all()


db.create_all()



