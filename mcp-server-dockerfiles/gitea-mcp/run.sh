#!/bin/bash

# Add conditional flags to the command
ADDITIONAL_ARGS=""

if [ "${GITEA_INSECURE}" = "true" ]; then
  ADDITIONAL_ARGS="${ADDITIONAL_ARGS} --insecure"
  echo "Adding --insecure flag"
fi

if [ "${DEBUG_MODE}" = "true" ]; then
  ADDITIONAL_ARGS="${ADDITIONAL_ARGS} -d"
  echo "Adding -d flag"
fi

# Create the docker-compose.override.yml to add conditional args
cat > docker-compose.override.yml << EOF
services:
  gitea-mcp-server:
    command: [
      "-t", "sse",
      "--host", "${GITEA_HOST}",
      "--token", "${GITEA_ACCESS_TOKEN}",
      "--listen", "0.0.0.0",
      "--port", "${SSE_PORT}"${ADDITIONAL_ARGS}
    ]
EOF

# Run docker compose
docker compose down
docker compose up -d

# Show logs
docker compose logs -f
