FROM python:alpine

WORKDIR /app
COPY requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt && apk add deluge
RUN python3 delugeSetup.py
EXPOSE 5006

ENTRYPOINT deluged && python3 app.py 0.0.0.0:5006
