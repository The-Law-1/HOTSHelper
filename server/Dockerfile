FROM node:lts-alpine
WORKDIR /HotsHelperApi
EXPOSE 3001

# copy local files
COPY [".", "/HotsHelperApi"]

RUN npm install -g npm@9.6.7

# install server dependencies and run server
RUN npm install --silent

# install nestjs
RUN npm install nestjs@latest -g

RUN ls

CMD ["npm", "start"]