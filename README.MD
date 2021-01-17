HyperTube Project
-
**Build and run via docker-compose in one command**

``docker-compose up --build``

**Run stand alone**

_Frontend_
- Install deps from frontend ``yarn install``
- Build frontend ``yarn run build``
- Move /static and /templates folder to backend

_Backend_
- Install deps from backend ``pip (or pip3) install -r requirements.txt``
- Install deluge into your system
- Run deluge daemon ``deluged``
- Run backend server ``python3 app.py 0.0.0.0:5006``
