# syntax=docker/dockerfile:1

FROM node:lts-fermium

ENV NODE_ENV=production
WORKDIR /app

COPY ["server/package.json", "yarn.lock", "./"]
RUN yarn install --production
COPY server .

CMD ["node", "src/app.js"]