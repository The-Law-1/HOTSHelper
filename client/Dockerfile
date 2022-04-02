FROM node:lts-alpine
WORKDIR /app
EXPOSE 3000

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY [".", "/app"]
RUN npm install --silent

# RUN npm run build

ENTRYPOINT ["/entrypoint.sh"]

# for some reason vite doesn't have a start command by default
CMD ["npm", "run", "dev"]