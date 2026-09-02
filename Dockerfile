# Install dependencies only when needed
FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./

ENV YARN_NODE_LINKER=node-modules
RUN corepack enable
RUN yarn install --immutable

# Rebuild the source code only when needed
FROM node:20-alpine AS builder

ARG NEXT_PUBLIC_BACKEND
ENV NEXT_PUBLIC_BACKEND=${NEXT_PUBLIC_BACKEND}

WORKDIR /app
COPY package.json yarn.lock ./
COPY client ./client
COPY server ./server

ENV YARN_NODE_LINKER=node-modules
RUN corepack enable
RUN yarn install --immutable

# Build Next.js client and Express backend
RUN yarn build
RUN yarn build:backend

# Production image, copy all the files and run apps
FROM node:20-alpine AS runner
WORKDIR /app/client
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/America/Chicago /etc/localtime

ENV NODE_ENV=production

# Copy Next.js frontend standalone build artifacts
COPY --from=builder /app/client/next.config.js ./
COPY --from=builder /app/client/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/client/.next/standalone/client ./
COPY --from=builder /app/client/.next/static ./.next/static

# Copy compiled backend output from server/build
WORKDIR /app/server
COPY --from=builder /app/server/build ./
RUN corepack enable
RUN yarn install

WORKDIR /app/client
ENV YARN_NODE_LINKER=node-modules
RUN corepack enable
RUN yarn install


WORKDIR /app
COPY docker-runner.sh ./
RUN chmod +x ./docker-runner.sh
EXPOSE 80 90
ENV PORT=80
ENV TZ="America/Chicago"

CMD [ "sh", "./docker-runner.sh" ]