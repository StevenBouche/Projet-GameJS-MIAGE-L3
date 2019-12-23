FROM node:12.11.1
# Create app directory

RUN echo 'fs.inotify.max_user_watches=524288' >> /etc/sysctl.conf

RUN cat /proc/sys/fs/inotify/max_user_watches

WORKDIR /server
COPY package*.json /server/
COPY . /server/
RUN mv ./shared ../shared
RUN ls -l

# Install app dependencies
#COPY package*.json /server/

#RUN npm install --save

# Copy app source code



#Expose port and start application
EXPOSE 3001
#RUN npm start
CMD ["npm", "start"]
