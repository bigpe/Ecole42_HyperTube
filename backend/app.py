from flask import Flask, jsonify, render_template, send_from_directory
from flasgger import Swagger, swag_from, LazyJSONEncoder
from flask_cors import CORS
import api
from globalUtils import addressInit
from delugeSetup import setupApp
from flask_sqlalchemy import SQLAlchemy


class HyperTubeApp(Flask):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.config.from_object('config')
        self.url_map.strict_slashes = False
        self.json_encoder = LazyJSONEncoder
        Swagger(self, **self.config['SWAGGER'])
        CORS(self, supports_credentials=True)
        setupApp()
        self.db = SQLAlchemy(self)


app = HyperTubeApp(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('base.html')


@app.route('/downloads/<path:path>/')
def sendDownload(path):
    return send_from_directory('downloads', path)


@app.route('/subtitles/<path:path>/')
def sendSubtitles(path):
    return send_from_directory('subtitles', path)


@app.route('/media/<path:path>/')
def sendMedia(path):
    return send_from_directory('media', path)


@app.route('/movies/', methods=['POST'])
@swag_from('spec/movies.yml')
def getMovies():
    return jsonify(api.getMovies())


@app.route('/movie/subtitles/', methods=['POST'])
@swag_from('spec/movie-subtitles.yml')
def getMovieSubtitles():
    return jsonify(api.getMovieSubtitles())


@app.route('/movie/', methods=['POST'])
@swag_from('spec/movie.yml')
def getMovie():
    return jsonify(api.getMovie())


@app.route('/person/<int:person_id>/', methods=['POST'])
@swag_from('spec/person.yml')
def getPerson(person_id):
    return jsonify(api.getPerson(person_id))


@app.route('/genres/', methods=['POST'])
@swag_from('spec/genres.yml')
def getGenres():
    return jsonify(api.getGenres())


@app.route('/movie/start/', methods=['POST'])
@swag_from('spec/movie-load-start.yml')
def startLoadMovie():
    return jsonify(api.startLoadMovie())


@app.route('/movie/stop/', methods=['POST'])
@swag_from('spec/movie-load-stop.yml')
def stopLoadMovie():
    return jsonify(api.stopLoadMovie())


def removeMovie():
    ...


@app.route('/movie/status/', methods=['POST'])
@swag_from('spec/movie-load-status.yml')
def statusLoadMovie():
    return jsonify(api.statusLoadMovie())


@app.route('/user/', methods=['GET'])
@swag_from('spec/user-info.yml')
def getUser():
    return jsonify(api.getUser())


@app.route('/user/', methods=['POST'])
@swag_from('spec/user-change.yml')
def changeUser():
    return jsonify(api.changeUser())


@app.route('/user/', methods=['PUT'])
@swag_from('spec/user-create.yml')
def createUser():
    return jsonify(api.createUser())


@app.route('/user/login/', methods=['POST'])
@swag_from('spec/user-check-login-exist.yml')
def checkLoginExist():
    return jsonify(api.checkLoginExist())


@app.route('/user/email/', methods=['POST'])
@swag_from('spec/user-check-email-exist.yml')
def checkEmailExist():
    return jsonify(api.checkEmailExist())


@app.route('/user/auth/', methods=['POST'])
@swag_from('spec/user-auth.yml')
def authUser():
    return jsonify(api.authUser())


@app.route('/user/auth/', methods=['GET'])
@swag_from('spec/user-check-auth.yml')
def checkAuthUser():
    return jsonify(api.checkAuth())


@app.route('/user/logout/', methods=['GET'])
@swag_from('spec/user-logout.yml')
def logoutUser():
    return jsonify(api.logoutUser())


@app.route('/user/password/check/', methods=['POST'])
@swag_from('spec/user-check-password.yml')
def checkPassword():
    return jsonify(api.checkPassword())


@app.route('/commentary/', methods=['PUT'])
@swag_from('spec/commentary-create.yml')
def createCommentary():
    return jsonify(api.createCommentary())


@app.route('/movie/commentaries/', methods=['POST'])
@swag_from('spec/movie-commentaries.yml')
def getMovieCommentaries():
    return jsonify(api.getMovieCommentaries())


@app.route('/user/auth/google/', methods=['GET'])
def authUserGoogle():
    return jsonify(api.authUserGoogle())


@app.route('/subtitles/', methods=['GET'])
@swag_from('spec/subtitles.yml')
def getSubtitles():
    return jsonify(api.getSubtitles())


if __name__ == '__main__':
    app.run(**addressInit(), threaded=True, debug=True)

