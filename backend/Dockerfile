FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY scripts ./scripts
COPY src ./src

CMD ["sh", "-c", "node scripts/ensure-runtime.js && node src/server.js"]
