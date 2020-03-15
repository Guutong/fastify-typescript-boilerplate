import * as fastify from "fastify";
import * as fastifyBlipp from "fastify-blipp";
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
server.register(fastifyBlipp);
server.register(errorThrowerRoutes);
server.register(customersRoutes);
server.register(statusRoutes);

const start = async () => {
  try {
    await server.listen(3000, "0.0.0.0");
    server.blipp();
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