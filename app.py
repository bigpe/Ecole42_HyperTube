from flask import Flask, jsonify, render_template, send_from_directory, request
from flasgger import Swagger, swag_from, LazyJSONEncoder
from flask_cors import CORS
import api
import globalUtils
from delugeSetup import setupApp


class HyperTubeApp(Flask):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.config.from_object('config')
        self.json_encoder = LazyJSONEncoder
        Swagger(self, **self.config['SWAGGER'])
        CORS(self)
        setupApp()


app = HyperTubeApp(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')


@app.route('/downloads/<path:path>')
def sendFile(path):
    return send_from_directory('downloads', path)


@app.route('/movies/', methods=['POST', 'OPTIONS'])
@swag_from('spec/movies.yml')
def getMovies():
    return jsonify(api.getMovies())


@app.route('/movie/', methods=['POST', 'OPTIONS'])
@swag_from('spec/movie.yml')
def getMovie():
    return jsonify(api.getMovie())


@app.route('/person/<int:person_id>/', methods=['POST', 'OPTIONS'])
@swag_from('spec/person.yml')
def getPerson(person_id):
    return jsonify(api.getPerson(person_id))


@app.route('/genres/', methods=['POST', 'OPTIONS'])
@swag_from('spec/genres.yml')
def getGenres():
    return jsonify(api.getGenres())


@app.route('/movie/start/', methods=['POST', 'OPTIONS'])
@swag_from('spec/movie-start.yml')
def startLoadMovie():
    return jsonify(api.startLoadMovie())


@app.route('/movie/stop/', methods=['POST', 'OPTIONS'])
@swag_from('spec/movie-stop.yml')
def stopLoadMovie():
    return jsonify(api.stopLoadMovie())


def removeMovie():
    ...


@app.route('/movie/status/', methods=['POST', 'OPTIONS'])
@swag_from('spec/movie-status.yml')
def statusMovie():
    return jsonify(api.statusLoadMovie())


if __name__ == '__main__':
    app.run(**globalUtils.addressInit(), threaded=True)
