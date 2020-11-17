FROM python:3.9-alpine

WORKDIR /app

COPY requirements.txt .

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk add --update --no-cache deluge
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 5006

CMD "deluged"

ENTRYPOINT deluged && python3 app.py 0.0.0.0:5006
