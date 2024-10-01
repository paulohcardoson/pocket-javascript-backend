import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import {
	validatorCompiler,
	serializerCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

import env from "@shared/env";
import { routes } from "./routes";

const app = fastify();

app.register(fastifyCors, { origin: "*" });

// Fastify Zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.withTypeProvider<ZodTypeProvider>().register(routes);

app
	.listen({ port: env.APP_PORT })
	.then(() => console.log(`Listening on port ${env.APP_PORT}`));
