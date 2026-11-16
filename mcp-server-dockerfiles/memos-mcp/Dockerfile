# Build stage
FROM node:22-alpine AS builder

RUN apk add --no-cache git protobuf

WORKDIR /app
RUN git clone https://github.com/andreroggeri/memo-mcp.git . && \
    npm ci && \
    npm run gen:api && \
    npm run build && \
    npm prune --omit=dev

# Production stage
FROM node:22-alpine

RUN apk add --no-cache curl

WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV NODE_ENV=production
ENV MCP_TRANSPORT=http
ENV PORT=3002
EXPOSE 3002

ENTRYPOINT ["/app/start.sh"]
