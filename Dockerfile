# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder

ARG NEXT_PUBLIC_BACKEND
ENV NEXT_PUBLIC_BACKEND=${NEXT_PUBLIC_BACKEND}

WORKDIR /app/client
COPY --from=deps /app/node_modules ./node_modules
COPY client ./
COPY package.json ./
RUN yarn build

WORKDIR /app/server
COPY ["server/.env", "server/esbuild.js", "package.json", "./"]
COPY server ./
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build:backend

# Production image, copy all the files and run apps
FROM node:16-alpine AS runner
WORKDIR /app/client
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/America/Chicago /etc/localtime

ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/client/next.config.js ./
COPY --from=builder /app/client/public ./public
COPY --from=builder /app/client/package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/client/.next/standalone ./
COPY --from=builder /app/client/.next/static ./.next/static

WORKDIR /app/server
COPY --from=builder /app/server/build ./
RUN yarn install --production

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app
COPY docker-runner.sh ./
RUN chmod +x ./docker-runner.sh
RUN ls -la
RUN pwd
EXPOSE 80 90
ENV PORT 80
ENV TZ "America/Chicago"

CMD [ "sh", "./docker-runner.sh" ]
