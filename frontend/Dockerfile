FROM node:alpine

WORKDIR /app

COPY package.json .
COPY src ./src
COPY public ./public
COPY webpack.config.js .
COPY .babelrc .

ONBUILD RUN npm i
ONBUILD RUN npm run build


CMD ["sh", "-c", "tail -f /dev/null"]