FROM node:16.3.0-alpine AS build

COPY --chown=node:node package.json package-lock.json ./
# ✅ Safe install
RUN npm ci 
COPY --chown=node:node src ./src
RUN npm run build


# Run-time stage
FROM node:16.3.0-alpine

COPY --chown=node:node --from=build package.json package-lock.json ./
COPY --chown=node:node --from=build node_modules ./node_modules
COPY --chown=node:node --from=build dist ./dist

# ✅ Clean dev packages
RUN npm prune --production

USER node
EXPOSE 1995

CMD [ "node", "dist/server.js" ]
