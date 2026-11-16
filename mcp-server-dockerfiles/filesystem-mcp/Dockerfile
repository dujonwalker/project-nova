FROM rust:1.89-slim-bookworm AS builder

ARG RUST_MCP_FS_VERSION=0.4.5
ARG RUST_MCP_FS_SRC_SHA256=7aa0624f4834087cba87553226cba48dc3957d80714539483b05e8ab09ef1225

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential cmake curl ca-certificates patch pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
RUN curl -fsSL "https://github.com/rust-mcp-stack/rust-mcp-filesystem/releases/download/v${RUST_MCP_FS_VERSION}/source.tar.gz" -o source.tar.gz \
    && echo "${RUST_MCP_FS_SRC_SHA256}  source.tar.gz" | sha256sum -c - \
    && tar -xzf source.tar.gz --strip-components=1 \
    && rm -f source.tar.gz

COPY http-transport.patch /tmp/http-transport.patch
RUN patch -p1 < /tmp/http-transport.patch \
    && cargo test --test test_cli \
    && cargo build --release

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /data

COPY --from=builder /src/target/release/rust-mcp-filesystem /usr/local/bin/rust-mcp-filesystem

ENV MCP_TRANSPORT=http \
    SSE_HOST=0.0.0.0 \
    SSE_PORT=3022 \
    ALLOW_WRITE=true \
    ENABLE_ROOTS=false \
    MCP_JSON_RESPONSE=false

EXPOSE 3022

ENTRYPOINT ["/usr/local/bin/rust-mcp-filesystem"]
CMD ["/data"]
