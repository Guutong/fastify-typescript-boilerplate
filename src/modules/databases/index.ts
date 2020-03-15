import { Model } from "mongoose";
import * as Mongoose from "mongoose";
import { CustomerModel, Customer } from "../../databases/models/customer";
import * as fp from "fastify-plugin";

export interface Models {
  Customer: Model<CustomerModel>;
}

export interface Db {
  models: Models;
}

export default fp(async (fastify, opts: { uri: string }, next) => {
  Mongoose.connection.on("connected", () => {
    fastify.log.info({ actor: "MongoDB" }, "connected");
  });

  Mongoose.connection.on("disconnected", () => {
    fastify.log.error({ actor: "MongoDB" }, "disconnected");
  });

  await Mongoose.connect(opts.uri, {
    useNewUrlParser: true,
    keepAlive: true
  });

  const models: Models = {
    Customer: Customer
  };

  fastify.decorate("db", { models });

  next();
});
