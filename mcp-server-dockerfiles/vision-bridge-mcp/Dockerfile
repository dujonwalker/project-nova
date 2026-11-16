FROM node:22-alpine AS builder

ARG VISION_BRIDGE_VERSION=0.1.2
ARG VISION_BRIDGE_COMMIT=4c4a201ac104e0179155e6e54134e037f60c4ecb
ARG VISION_BRIDGE_SRC_SHA256=2ff540374e5cad71744558c0329906ebdb91e098103f9f781f0fe2836d6ecc41

RUN apk add --no-cache curl ca-certificates patch

WORKDIR /app
RUN curl -fsSL "https://github.com/yanuadin/vision-bridge-mcp/archive/${VISION_BRIDGE_COMMIT}.tar.gz" -o source.tar.gz \
    && echo "${VISION_BRIDGE_SRC_SHA256}  source.tar.gz" | sha256sum -c - \
    && tar -xzf source.tar.gz --strip-components=1 \
    && rm -f source.tar.gz

COPY http-transport.patch /tmp/http-transport.patch
RUN patch -p1 < /tmp/http-transport.patch \
    && rm -f /tmp/http-transport.patch

RUN npm ci \
    && npm run lint \
    && npm test \
    && npm prune --omit=dev \
    && npm cache clean --force

FROM node:22-alpine AS production

RUN apk upgrade --no-cache && \
    apk add --no-cache tini

WORKDIR /app

COPY --from=builder --chown=root:root /app/node_modules ./node_modules
COPY --from=builder --chown=root:root /app/src ./src
COPY --from=builder --chown=root:root /app/package.json ./package.json

USER node

ENV NODE_ENV=production \
    MCP_TRANSPORT=streamable-http \
    SSE_HOST=0.0.0.0 \
    SSE_PORT=3024 \
    MCP_STATELESS_HTTP=true \
    VISION_BRIDGE_MAX_IMAGE_MB=20

RUN SSE_HOST=127.0.0.1 SSE_PORT=13024 MCP_TRANSPORT=streamable-http \
    node -e ' \
      const { spawn } = require("node:child_process"); \
      const child = spawn("node", ["src/index.js"], { stdio: ["ignore", "pipe", "pipe"] }); \
      let logs = ""; \
      child.stdout.on("data", (d) => { logs += d; }); \
      child.stderr.on("data", (d) => { logs += d; }); \
      const stop = (code) => { child.kill("SIGTERM"); process.exit(code); }; \
      (async () => { \
        for (let i = 0; i < 40; i++) { \
          try { \
            const r = await fetch("http://127.0.0.1:13024/health"); \
            if (r.ok) break; \
          } catch {} \
          await new Promise((r) => setTimeout(r, 100)); \
        } \
        const h = { "Content-Type": "application/json", "Accept": "application/json, text/event-stream" }; \
        const hz = await fetch("http://127.0.0.1:13024/healthz"); \
        if (!hz.ok) throw new Error("healthz failed"); \
        const init = await fetch("http://127.0.0.1:13024/mcp", { \
          method: "POST", headers: h, \
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "smoke", version: "1.0" } } }) \
        }); \
        if (!init.ok) throw new Error("init failed: " + init.status + " " + logs); \
        await fetch("http://127.0.0.1:13024/mcp", { \
          method: "POST", headers: h, \
          body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) \
        }); \
        const listRes = await fetch("http://127.0.0.1:13024/mcp", { \
          method: "POST", headers: h, \
          body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }) \
        }); \
        const txt = await listRes.text(); \
        if (!txt.includes("analyze_image") || !txt.includes("ocr_image")) { \
          throw new Error("Expected tools in tools/list, got: " + txt); \
        } \
        console.log("smoke-ok: analyze_image and ocr_image exposed"); \
        stop(0); \
      })().catch((e) => { console.error(e, logs); stop(1); }); \
    '

EXPOSE 3024

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.SSE_PORT||3024)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/index.js"]
