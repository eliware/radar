FROM ghcr.io/eliware/centos10-node26:latest AS build

USER root
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
COPY webpack.config.mjs ./webpack.config.mjs
RUN npm run build

FROM ghcr.io/eliware/centos10-node26:latest

ENV NODE_ENV=production
USER root
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node bin/radar.mjs ./bin/radar.mjs
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
COPY --chown=node:node nasr/NASR.sqlite ./nasr/NASR.sqlite
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 1390
CMD ["node", "bin/radar.mjs"]
