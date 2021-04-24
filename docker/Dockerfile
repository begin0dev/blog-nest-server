FROM node:14

MAINTAINER begin0dev <prosonic1@gmail.com>

RUN mkdir -p /app
WORKDIR /app

COPY ../package*.json ./
COPY ../newrelic.js ./
COPY ../config ./config
COPY ../env ./
COPY ../dist ./
RUN mkdir -p /logs

RUN npm ci --only=production

EXPOSE 3001
ENV NODE_ENV production
CMD ["npm", "start"]
