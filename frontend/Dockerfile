FROM node:alpine

WORKDIR /app

COPY package.json .
COPY src ./src
COPY public ./public
COPY webpack.config.js .
COPY .babelrc .

ONBUILD RUN yarn install
ONBUILD RUN yarn run build