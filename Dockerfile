FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile --prod=false

COPY . .

RUN mkdir -p /app/.tmp/data && \
    chmod -R 777 /app/.tmp

RUN pnpm build

EXPOSE 1337

CMD ["npm", "run", "start"]