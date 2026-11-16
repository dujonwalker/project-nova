# Build stage
FROM golang:1.24-alpine AS builder

RUN apk add --no-cache git ca-certificates

WORKDIR /build
RUN git clone https://gitea.com/gitea/gitea-mcp.git . && \
    go mod download && \
    CGO_ENABLED=0 GOOS=linux go build -o /build/gitea-mcp .

# Runtime stage
FROM alpine:3.21

RUN apk add --no-cache ca-certificates curl bash

WORKDIR /app
COPY --from=builder /build/gitea-mcp /app/gitea-mcp
COPY start.sh /app/start.sh
RUN chmod +x /app/gitea-mcp /app/start.sh && \
    mkdir -p /home/gitea-mcp/.gitea-mcp

ENV MCP_PORT=3008
EXPOSE 3008

ENTRYPOINT ["/app/start.sh"]
