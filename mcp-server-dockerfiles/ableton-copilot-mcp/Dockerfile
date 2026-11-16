FROM python:3.12-slim-bookworm

ARG ABLETON_MCP_COMMIT=9dddc7bd5b95412510fdeb745949e3bf23f3fd8a
ARG ABLETON_MCP_SRC_SHA256=acee4544414b3a6ed229fbde9ff06d488218f3bbb9423f336f9474e6797d69ea

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates patch \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN curl -fsSL "https://github.com/ahujasid/ableton-mcp/archive/${ABLETON_MCP_COMMIT}.tar.gz" -o source.tar.gz \
    && echo "${ABLETON_MCP_SRC_SHA256}  source.tar.gz" | sha256sum -c - \
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
    SSE_PORT=3013 \
    MCP_STATELESS_HTTP=true \
    MCP_JSON_RESPONSE=false \
    ABLETON_MCP_DISABLE_TELEMETRY=1

EXPOSE 3013

ENTRYPOINT ["ableton-mcp"]
