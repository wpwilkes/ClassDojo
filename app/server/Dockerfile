FROM node:24-bookworm-slim AS development

WORKDIR /summit/app/server

COPY app/server/package.json app/server/package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY .prettierrc .prettierignore /summit/
COPY app/server/ ./
COPY app/client/ /summit/app/client/

FROM development AS test
CMD ["npm", "test"]

FROM development AS build
RUN npm run build

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000 ALLOW_DEV_USER_HEADERS=false

WORKDIR /summit/app/server

COPY app/server/package.json app/server/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY --from=build /summit/app/server/dist/ ./dist/
COPY app/client/src/ /summit/app/client/src/

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]