FROM python:3.12-slim-bookworm

ARG OBS_MCP_VERSION=0.2.0
ARG OBS_MCP_SRC_SHA256=8c9088ac26c94b53ae843b66477af04cac2162824ff5a7b8aa4373553380adb4

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates patch \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN curl -fsSL "https://github.com/xDarkzx/OBS_MCP/archive/refs/tags/v${OBS_MCP_VERSION}.tar.gz" -o source.tar.gz \
    && echo "${OBS_MCP_SRC_SHA256}  source.tar.gz" | sha256sum -c - \
    && tar -xzf source.tar.gz --strip-components=1 \
    && rm -f source.tar.gz

COPY http-transport.patch /tmp/http-transport.patch
RUN patch -p1 < /tmp/http-transport.patch \
    && rm -f /tmp/http-transport.patch \
    && pip install --no-cache-dir "mcp[cli]==1.30.0" ".[dev]" \
    && pytest -q \
    && pip uninstall -y pytest pytest-asyncio

ENV MCP_TRANSPORT=streamable-http \
    SSE_HOST=0.0.0.0 \
    SSE_PORT=3012 \
    MCP_STATELESS_HTTP=true \
    MCP_JSON_RESPONSE=false

EXPOSE 3012

ENTRYPOINT ["obs-mcp"]
