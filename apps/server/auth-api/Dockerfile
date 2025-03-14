# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=workspace package.json yarn.lock ./
COPY --from=workspace .yarn ./yarn

COPY --from=workspace apps/server/auth-api ./apps/server/auth-api

RUN corepack enable
RUN yarn

RUN yarn build:all

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock /app/.pnp.cjs /app/.pnp.loader.mjs* /app/
COPY --from=builder /app/apps/server/auth-api/dist ./dist

ENV NODE_ENV=production

EXPOSE 1234

CMD ["node", "dist/server.js"]