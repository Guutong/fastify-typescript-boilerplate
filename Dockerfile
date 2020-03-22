# Step 1: Build the app in image 'builder'
FROM node:12.8-alpine as build

WORKDIR /app
COPY . .
RUN apk --no-cache add make gcc g++ python bash
RUN npm i -g yarn --force
RUN yarn install --silent && yarn build

# Step 2: Use build output from 'builder'
FROM node:12.8-alpine

COPY --from=build /app /

EXPOSE 3000
CMD ["npm", "start", "--silent"]