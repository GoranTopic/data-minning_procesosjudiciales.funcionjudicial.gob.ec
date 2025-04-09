FROM node:22

# root user to be able to access mount directory
USER root

WORKDIR procesosjudiciales
# copy package files and tsconfig
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY src/ src/

# install dependencies and build TypeScript
RUN npm install
RUN npm run build

# works with this command
# sudo docker run -d -it --network="host" --restart=always procesosjudiciales npm run slave

