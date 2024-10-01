import z from "zod";

const schema = z.object({
	// Application
	APP_PORT: z.coerce.number().int(),

	// PostgreSQL
	POSTGRESQL_URL: z.string().url(),
});

const env = schema.parse(process.env);

export default env;
