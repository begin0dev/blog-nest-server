FROM node:14

MAINTAINER begin0dev <prosonic1@gmail.com>

RUN mkdir -p /app
WORKDIR /app

COPY package-lock.json ./
COPY newrelic.js ./
COPY config ./config
COPY .env ./
COPY dist ./

RUN mkdir -p /logs

RUN npm ci --only=production

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

CMD ["npm", "start"]
