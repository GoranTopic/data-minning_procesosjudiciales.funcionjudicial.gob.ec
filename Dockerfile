FROM node:22

# root user to be able to access ount directory
USER root

WORKDIR procesosjudiciales
# pass our own package.json
COPY package.json package.json
COPY src/ src/

# install files 
RUN npm install

# works with this command
# sudo docker run -d -it --network="host" --restart=always procesosjudiciales npm run slave

