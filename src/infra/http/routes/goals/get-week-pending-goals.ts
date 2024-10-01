import type {
	FastifyPluginAsyncZod,
	FastifyPluginCallbackZod,
} from "fastify-type-provider-zod";
import z from "zod";
import { getWeekPendingGoals } from "@functions/get-week-pending-goals";

export const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/pending-goals", async (req, res) => {
		const { pendingGoals } = await getWeekPendingGoals();

		return { pendingGoals };
	});
};
