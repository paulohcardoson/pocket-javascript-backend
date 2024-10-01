import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";

// Routes
import { createGoalRoute } from "@routes/goals/create-goal";
import { createGoalCompletionRoute } from "@routes/goals/create-goal-completion";
import { getWeekPendingGoalsRoute } from "@routes/goals/get-week-pending-goals";
import { getWeekSummaryRoute } from "./goals/get-week-summary";

export const routes: FastifyPluginCallbackZod = (fastify, opts, done) => {
	// Goals
	fastify.register(createGoalRoute);
	fastify.register(getWeekPendingGoalsRoute);
	fastify.register(createGoalCompletionRoute);
	fastify.register(getWeekSummaryRoute);

	done();
};
