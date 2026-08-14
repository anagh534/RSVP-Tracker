# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S expressjs -u 1001

COPY package*.json ./
RUN npm ci --only=production

# Copy built code
COPY --from=builder --chown=expressjs:nodejs /app/config ./config
COPY --from=builder --chown=expressjs:nodejs /app/controllers ./controllers
COPY --from=builder --chown=expressjs:nodejs /app/middleware ./middleware
COPY --from=builder --chown=expressjs:nodejs /app/models ./models
COPY --from=builder --chown=expressjs:nodejs /app/routes ./routes
COPY --from=builder --chown=expressjs:nodejs /app/services ./services
COPY --from=builder --chown=expressjs:nodejs /app/index.js ./index.js
COPY --from=builder --chown=expressjs:nodejs /app/rules.md ./rules.md

USER expressjs

EXPOSE 3001

CMD ["node", "index.js"]
