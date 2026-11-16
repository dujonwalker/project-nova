FROM python:3.12-slim-bookworm

ARG REAPER_MCP_VERSION=0.8.3
ARG REAPER_MCP_SRC_SHA256=3827dff447510a97879ec8af709c7de7a63c04b96af6df20994e82fb0cf4526b

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates patch libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN curl -fsSL "https://github.com/xDarkzx/Reaper-MCP/archive/refs/tags/v${REAPER_MCP_VERSION}.tar.gz" -o source.tar.gz \
    && echo "${REAPER_MCP_SRC_SHA256}  source.tar.gz" | sha256sum -c - \
    && tar -xzf source.tar.gz --strip-components=1 \
    && rm -f source.tar.gz

COPY http-transport.patch /tmp/http-transport.patch
RUN patch -p1 < /tmp/http-transport.patch \
    && rm -f /tmp/http-transport.patch \
    && pip install --no-cache-dir "mcp[cli]==1.30.0" ".[analysis,dev]" \
    && pytest -q \
    && pip uninstall -y pytest pytest-asyncio ruff lupa

ENV MCP_TRANSPORT=streamable-http \
    SSE_HOST=0.0.0.0 \
    SSE_PORT=3015 \
    MCP_STATELESS_HTTP=true \
    MCP_JSON_RESPONSE=false \
    REAPER_IPC_DIR=/ipc/reaper_mcp \
    REAPER_IPC_SHARED=true

EXPOSE 3015

ENTRYPOINT ["reaper-mcp"]
