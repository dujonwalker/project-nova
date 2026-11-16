# Build stage
FROM golang:1.26-alpine AS builder

ARG MCP_SHELL_VERSION=1.1.1
ARG MCP_SHELL_COMMIT=b358b02bcad8509353dacdeb39762801433fea42
ARG MCP_SHELL_SRC_SHA256=d27fb0771f1639703690045e9ff5e573fd865661bbe579b8ea384d9254bce432

RUN apk add --no-cache curl git bash patch

WORKDIR /app

RUN curl -fsSL "https://github.com/sonirico/mcp-shell/archive/${MCP_SHELL_COMMIT}.tar.gz" -o source.tar.gz \
    && echo "${MCP_SHELL_SRC_SHA256}  source.tar.gz" | sha256sum -c - \
    && tar -xzf source.tar.gz --strip-components=1 \
    && rm -f source.tar.gz

RUN go mod download

COPY http-transport.patch /tmp/http-transport.patch
RUN patch -p1 < /tmp/http-transport.patch \
    && rm -f /tmp/http-transport.patch

RUN go test -v ./...

RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags "-X main.version=${MCP_SHELL_VERSION} -s -w -extldflags '-static'" \
    -a -installsuffix cgo \
    -o mcp-shell .

# Runtime stage
FROM alpine:3.22

RUN apk add --no-cache \
    bash \
    curl \
    wget \
    git \
    make \
    findutils \
    grep \
    sed \
    gawk \
    tar \
    gzip \
    unzip \
    jq \
    ripgrep \
    python3 \
    openssh-client \
    docker-cli \
    docker-cli-compose \
    ca-certificates \
    && rm -rf /var/cache/apk/*

RUN addgroup -g 1000 mcpuser && \
    adduser -D -s /bin/bash -u 1000 -G mcpuser mcpuser

RUN mkdir -p /workspace /tmp/mcp-workspace /etc/mcp-shell && \
    chown -R mcpuser:mcpuser /workspace /tmp/mcp-workspace /etc/mcp-shell

COPY --from=builder /app/mcp-shell /usr/local/bin/mcp-shell
RUN chmod +x /usr/local/bin/mcp-shell

COPY --from=builder /app/security.yaml /etc/mcp-shell/security.yaml
COPY security-unsafe.yaml /etc/mcp-shell/security-unsafe.yaml

ENV MCP_TRANSPORT=streamable-http \
    SSE_HOST=0.0.0.0 \
    SSE_PORT=3009 \
    MCP_STATELESS_HTTP=true \
    MCP_SHELL_ALLOW_UNSAFE=1 \
    MCP_SHELL_SEC_CONFIG_FILE=/etc/mcp-shell/security-unsafe.yaml \
    MCP_SHELL_LOG_LEVEL=info \
    MCP_SHELL_LOG_FORMAT=console \
    MCP_SHELL_LOG_OUTPUT=stderr \
    PATH="/usr/local/bin:${PATH}"

USER mcpuser
WORKDIR /workspace

RUN SSE_HOST=127.0.0.1 SSE_PORT=13009 MCP_TRANSPORT=streamable-http \
    MCP_SHELL_ALLOW_UNSAFE=1 MCP_SHELL_SEC_CONFIG_FILE=/etc/mcp-shell/security-unsafe.yaml \
    sh -c ' \
      set -e; \
      /usr/local/bin/mcp-shell >/tmp/smoke.log 2>&1 & \
      pid=$!; \
      trap "kill $pid 2>/dev/null || true; rm -f /tmp/smoke.log" EXIT; \
      i=0; while ! curl -fsS http://127.0.0.1:13009/health >/dev/null 2>&1; do \
        i=$((i+1)); [ "$i" -lt 30 ] || { cat /tmp/smoke.log; exit 1; }; \
        sleep 0.1; \
      done; \
      curl -fsS http://127.0.0.1:13009/healthz | grep -q "\"unsafe\":true"; \
      curl -fsS -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
        -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{\"protocolVersion\":\"2025-03-26\",\"capabilities\":{},\"clientInfo\":{\"name\":\"smoke\",\"version\":\"1.0\"}}}" \
        http://127.0.0.1:13009/mcp | grep -q "mcp-shell"; \
      curl -fsS -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
        -d "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"tools/list\",\"params\":{}}" \
        http://127.0.0.1:13009/mcp | grep -q "shell_exec"; \
      curl -fsS -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
        -d "{\"jsonrpc\":\"2.0\",\"id\":3,\"method\":\"tools/call\",\"params\":{\"name\":\"shell_exec\",\"arguments\":{\"command\":\"echo smoke-ok && pwd\"}}}" \
        http://127.0.0.1:13009/mcp | grep -q "smoke-ok" \
    '

EXPOSE 3009

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -fsS "http://127.0.0.1:${SSE_PORT:-3009}/health" >/dev/null || exit 1

ENTRYPOINT ["/usr/local/bin/mcp-shell"]
