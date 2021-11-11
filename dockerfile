FROM node:14.17.6-buster-slim

WORKDIR /app
COPY package.json /app/

RUN npm i --only=production --ignore-scripts
COPY dist/prod.js /app/


ENV NODE_ENV production
ENV BUILD WEBPACK
ENV CLIENT_URL https://same-client-ui.herokuapp.com
ENV SECRET=SameCapstoneProject

CMD node prod.js --bind:0.0.0.0










