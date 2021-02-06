from flasgger import LazyString
from flask import request

SQLALCHEMY_DATABASE_URI = "sqlite:///db.sqlite3"
SQLALCHEMY_TRACK_MODIFICATIONS = False

JSONIFY_PRETTYPRINT_REGULAR = False
SWAGGER = {
    'config': {
        "headers": [],
        "specs": [
            {
                "endpoint": 'HyperTubeAPI',
                "route": '/HyperTubeAPI.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/api/"
    },
    'template': {
        "swagger": "2.0",
        "info": {
            "title": "HyperTube API",
            "description": "API for HyperTube project, 42 ecole",
            "contact": {
                "responsibleOrganization": "ME",
                "responsibleDeveloper": "Me",
                "email": "me@me.com",
                "url": "www.me.com",
            },
            "version": "0.1"
        },
        "host": LazyString(lambda: request.host),
        "basePath": "/",
        "schemes": [
            LazyString(lambda: 'https' if request.is_secure else 'http')
        ],
        "tags": [
            {"name": "Movies", "description": "Actions with movies"},
            {"name": "Persons", "description": "Actions with persons"},
            {"name": "Genres", "description": "Actions with genres"},
            {"name": "Users", "description": "Actions with users"},
            {"name": "Subtitles", "description": "Actions with subtitles"},
        ],
        'definitions': {
            'UserInfo': {
                'type': 'object',
                'properties': {
                    'firstName': {
                        'type': 'string'
                    },
                    'lastName': {
                        'type': 'string'
                    },
                    'email': {
                        'type': 'string'
                    },
                    'login': {
                        'type': 'string'
                    },
                    'userPhoto': {
                        'type': 'string'
                    },
                }
            },
            'AnswerAPI': {
                'type': 'object',
                'properties': {
                    'error': {
                        'type': 'boolean'
                    },
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
}
SECRET_KEY = '87,mad#124##$2139nmawjdnhH$#21'

# ^H в ключе - отправка заголовком
API_MAP = {
    'themoviedb': {'api_key': '6c60e65c45de8fc3495acac976c567ce'},
    'opensubtitles': {'Api-Key^H': '1xPMLpBzqrPAU893YsgmO65rDblq05Yd'},
}
