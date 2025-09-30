FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]

#docker build -t nestjs-project .
#docker compose up -d
#docker compose up
#you can go localhost:5050  and see connected dbpostgre db                    