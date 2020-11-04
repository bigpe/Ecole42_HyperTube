from flask import Flask, jsonify, request, Response, render_template, stream_with_context, send_from_directory
from flasgger import Swagger, swag_from, LazyJSONEncoder
import requests
from flask_cors import CORS
import api


class HyperTubeApp(Flask):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.config.from_object('config')
        self.json_encoder = LazyJSONEncoder
        Swagger(self, **self.config['SWAGGER'])
        CORS(self)


app = HyperTubeApp(__name__)


@app.route('/')
def test():
    return render_template('test.html')


@app.route('/downloads/<path:path>')
def sendFile(path):
    return send_from_directory('downloads', path)


@app.route('/player/<path:path>')
def sendStatic(path):
    return send_from_directory('player', path)


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
def getGenres():
    return jsonify(api.getGenres())


# language <String>
# region <String>
# sort_by
    # popularity.asc | .desc
    # release_date.asc | .desc
    # revenue.asc | .desc
    # primary_release_date.asc | .desc
    # original_title.asc | .desc
    # vote_average.asc | .desc
    # vote_count.asc | .desc
# certification_country <String>
# certification <String>
# include_adult <Boolean>
# include_video <Boolean>
# page <Integer>
# primary_release_year <Integer>
# with_release_type <Integer>
# year <Integer>
# with_cast <String>
# with_crew <String>
# with_people <String>
# with_companies <String>
# with_genres <String>
# without_genres <String>
# with_keywords <String>
# without_keywords <String>
# with_original_language <String>

@app.route('/discover/movie/', methods=['POST', 'OPTIONS'])
def discoverMovie():
    url = f'https://api.themoviedb.org/3/genre/movie/list/discover/movie'
    return api.getData(url)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8081)
