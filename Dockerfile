# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm i

COPY . .
COPY .env.template .env.production

# Overcome zScaler issues on local build
# ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001 -G nodejs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --chown=nextjs:nodejs /docker/docker-entrypoint.d/entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh
RUN chown -R nextjs:nodejs /app && chmod -R g+rwX /app

USER nextjs

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT [ "/docker-entrypoint.d/entrypoint.sh" ]
CMD HOSTNAME="0.0.0.0" node server.js
