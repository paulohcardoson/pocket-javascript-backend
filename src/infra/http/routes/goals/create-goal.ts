import type {
	FastifyPluginAsyncZod,
	FastifyPluginCallbackZod,
} from "fastify-type-provider-zod";
import { createGoal } from "@functions/create-goal";
import z from "zod";

export const createGoalRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/goals",
		{
			schema: {
				body: z.object({
					title: z.string().min(1).max(100),
					desiredWeeklyFrequency: z.number().int().min(1).max(7),
				}),
			},
		},
		async (request, response) => {
			const { title, desiredWeeklyFrequency } = request.body;

			const { goal } = await createGoal({
				title,
				desiredWeeklyFrequency,
			});

			return { goalId: goal.id };
		},
	);
};
