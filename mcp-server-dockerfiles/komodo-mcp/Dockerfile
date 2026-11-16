FROM node:22-alpine AS builder

ARG KOMODO_MCP_VERSION=1.5.0
ARG KOMODO_MCP_SRC_SHA256=742d2654f273252972e3aa70e213a5433cb2fddab9b87046324f39d248573194

RUN apk add --no-cache curl ca-certificates patch

WORKDIR /app
RUN curl -fsSL "https://github.com/MP-Tool/komodo-mcp-server/archive/refs/tags/${KOMODO_MCP_VERSION}.tar.gz" -o source.tar.gz \
    && echo "${KOMODO_MCP_SRC_SHA256}  source.tar.gz" | sha256sum -c - \
    && tar -xzf source.tar.gz --strip-components=1 \
    && rm -f source.tar.gz

COPY open-writes.patch /tmp/open-writes.patch
RUN patch -p1 < /tmp/open-writes.patch \
    && rm -f /tmp/open-writes.patch

RUN npm ci \
    && npm run build:prod \
    && npm test \
    && npm prune --omit=dev \
    && npm cache clean --force

FROM node:22-alpine AS production

RUN apk upgrade --no-cache && \
    apk add --no-cache tini

WORKDIR /app

COPY --from=builder --chown=root:root /app/node_modules ./node_modules
COPY --from=builder --chown=root:root /app/build ./build
COPY --from=builder --chown=root:root /app/package.json ./package.json

RUN mkdir -p /app/logs && chown node:node /app/logs \
    && sed -i 's|/home/node:/bin/sh|/home/node:/sbin/nologin|' /etc/passwd

USER node

ENV NODE_ENV=production \
    MCP_TRANSPORT=http \
    MCP_BIND_HOST=0.0.0.0 \
    MCP_PORT=3019 \
    MCP_AUTH_ENABLED=false \
    KOMODO_MCP_ALLOW_OPEN_WRITES=true \
    MCP_STATELESS=true \
    MCP_CONFIRM_FALLBACK=allow \
    MCP_SECRET_SCRUB_ENABLED=true

RUN MCP_BIND_HOST=127.0.0.1 MCP_PORT=13019 MCP_TRANSPORT=http \
    MCP_AUTH_ENABLED=false KOMODO_MCP_ALLOW_OPEN_WRITES=true MCP_STATELESS=true \
    node -e ' \
      const { spawn } = require("node:child_process"); \
      const child = spawn("node", ["build/index.js"], { stdio: ["ignore", "pipe", "pipe"] }); \
      let logs = ""; \
      child.stdout.on("data", (d) => { logs += d; }); \
      child.stderr.on("data", (d) => { logs += d; }); \
      const stop = (code) => { child.kill("SIGTERM"); process.exit(code); }; \
      (async () => { \
        for (let i = 0; i < 50; i++) { \
          try { \
            const r = await fetch("http://127.0.0.1:13019/ready"); \
            if (r.ok) break; \
          } catch {} \
          await new Promise((r) => setTimeout(r, 100)); \
        } \
        const h = { "Content-Type": "application/json", "Accept": "application/json, text/event-stream" }; \
        const init = await fetch("http://127.0.0.1:13019/mcp", { \
          method: "POST", headers: h, \
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "smoke", version: "1.0" } } }) \
        }); \
        if (!init.ok) throw new Error("init failed: " + init.status + " " + logs); \
        await fetch("http://127.0.0.1:13019/mcp", { \
          method: "POST", headers: h, \
          body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) \
        }); \
        const listRes = await fetch("http://127.0.0.1:13019/mcp", { \
          method: "POST", headers: h, \
          body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }) \
        }); \
        const txt = await listRes.text(); \
        if (!txt.includes("komodo_stack_action") || !txt.includes("komodo_exec")) { \
          throw new Error("Expected write tools in tools/list, got: " + txt.slice(0, 500)); \
        } \
        console.log("smoke-ok: write/operate tools exposed"); \
        stop(0); \
      })().catch((e) => { console.error(e, logs); stop(1); }); \
    '

EXPOSE 3019

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.MCP_PORT||3019)+'/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "build/index.js"]
