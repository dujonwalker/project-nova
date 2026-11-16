FROM python:3.12-slim-bookworm

ARG REAPER_QA_COMMIT=9f24f1076cc6f3349e3d25673f290c71d401aff0
ARG REAPER_QA_SRC_SHA256=e5d9b93f1e7c5ca459925ee71933dbbc3310cc0673b35ce7c2f7d3317d7652a8

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates patch libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN curl -fsSL "https://github.com/dschuler36/reaper-mcp-server/archive/${REAPER_QA_COMMIT}.tar.gz" -o source.tar.gz \
    && echo "${REAPER_QA_SRC_SHA256}  source.tar.gz" | sha256sum -c - \
    && tar -xzf source.tar.gz --strip-components=1 \
    && rm -f source.tar.gz

COPY http-transport.patch /tmp/http-transport.patch
RUN patch -p1 < /tmp/http-transport.patch \
    && rm -f /tmp/http-transport.patch \
    && pip install --no-cache-dir "mcp[cli]==1.30.0" . pytest \
    && pytest -q \
    && pip uninstall -y pytest

ENV MCP_TRANSPORT=streamable-http \
    SSE_HOST=0.0.0.0 \
    SSE_PORT=3017 \
    MCP_STATELESS_HTTP=true \
    MCP_JSON_RESPONSE=false \
    REAPER_PROJECTS_DIR="/data/Documents/REAPER Projects" \
    REAPER_RESOURCE_PATH=/data/.config/REAPER

EXPOSE 3017

ENTRYPOINT ["reaper-mcp-server"]
