FROM debian

WORKDIR /app
COPY requirements.txt /app
COPY package.json /app
COPY src /app/src
COPY public /app/public
COPY webpack.config.js /app
RUN apt update && apt install -y python3 python3-pip deluge deluged nodejs curl && apt clean
RUN pip3 install --no-cache-dir -r requirements.txt
RUN curl -L https://npmjs.org/install.sh | sh && npm i --legacy-peer-deps
COPY .babelrc /app
RUN cp -a /tmp/node_modules /app/node_modules
RUN webpack
EXPOSE 5006
CMD "deluged"

ENTRYPOINT deluged && python3 app.py 0.0.0.0:5006
