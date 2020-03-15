import * as fastify from "fastify";
import * as fastifyBlipp from "fastify-blipp";
import * as fastifySwagger from "fastify-swagger";
import * as config from "config";
import * as sourceMapSupport from "source-map-support";
import { Server, IncomingMessage, ServerResponse } from "http";
import statusRoutes from "./modules/routes/status";
import customersRoutes from "./modules/routes/customers";
import db from "./modules/databases";
import errorThrowerRoutes from "./modules/routes/error-thrower";

sourceMapSupport.install();

const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({logger:true});
server.register(db, config.get('db'));
server.register(fastifySwagger, {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Fastify Typescript Boilerplate Swagger',
      description: 'testing the fastify swagger api',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true
});
server.register(fastifyBlipp);
server.register(errorThrowerRoutes);
server.register(customersRoutes);
server.register(statusRoutes);

const start = async () => {
  try {
    await server.listen(3000, "0.0.0.0");
    server.blipp();
    server.swagger();
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on("uncaughtException", error => {
  console.error(error);
});
process.on("unhandledRejection", error => {
  console.error(error);
});

start();