from flasgger import LazyString
from flask import request

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
        ]
    }
}
