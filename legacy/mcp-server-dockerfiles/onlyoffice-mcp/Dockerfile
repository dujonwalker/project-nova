FROM node:22-alpine

RUN apk add --no-cache bash curl

WORKDIR /app
RUN npm init -y && npm install @onlyoffice/docspace-mcp

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV DOCSPACE_PORT=3001
EXPOSE 3001

CMD ["/app/start.sh"]
