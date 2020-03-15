import * as fp from "fastify-plugin";

export default fp(async (server, opts, next) => {
  server.get("/customers/:id", {}, async (request, reply) => {
    try {
      const _id = request.params.id;

      const customer = await server.db.models.Customer.findOne({
        _id
      });

      if (!customer) {
        return reply.send(404);
      }

      return reply.code(200).send(customer);
    } catch (error) {
      request.log.error(error);
      return reply.send(400);
    }
  });

  server.post("/customers", {}, async (request, reply) => {
    try {
      const { Customer } = server.db.models;

      const customer = await Customer.create(request.body);

      return reply.code(201).send(customer);
    } catch (error) {
      request.log.error(error);
      return reply.send(500);
    }
  });
  next();
});