#stage 1
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration=production

#stage 2
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production


COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund


COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/shopping-cart/server/server.mjs"]