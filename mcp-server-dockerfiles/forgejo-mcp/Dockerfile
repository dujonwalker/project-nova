# Build stage
FROM rust:1-bookworm AS builder

RUN apt-get update && apt-get install -y --no-install-recommends git pkg-config libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/forgejo-mcp
RUN git clone https://git.b4mad.industries/agentic-forges/forgejo-mcp.git . && \
    cargo build --release

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates libssl3 curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /usr/src/forgejo-mcp/target/release/forgejo-mcp /usr/local/bin/forgejo-mcp
COPY start.sh /app/start.sh
RUN chmod +x /usr/local/bin/forgejo-mcp /app/start.sh

ENV SSE_PORT=8989
EXPOSE 8989

ENTRYPOINT ["/app/start.sh"]
