# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=workspace package.json yarn.lock nx.json ./
COPY --from=workspace .yarn ./yarn

COPY --from=workspace apps/client/auth-app ./apps/client/auth-app

RUN corepack enable
RUN yarn

RUN yarn build:all

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock /app/.pnp.cjs /app/.pnp.loader.mjs* /app/
COPY --from=builder /app/apps/client/auth-app ./apps/client/auth-app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "workspace", "@robust-monorepo-yarn-nx-changesets/auth-app", "next", "start"]