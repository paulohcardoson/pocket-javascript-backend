import { db } from "../../db";
import { goals } from "../../db/schema";

export interface CreateGoalRequest {
	title: string;
	desiredWeeklyFrequency: number;
}

export const createGoal = async (request: CreateGoalRequest) => {
	const { title, desiredWeeklyFrequency } = request;

	const [goal] = await db
		.insert(goals)
		.values({
			title,
			desiredWeeklyFrequency,
		})
		.returning();

	return { goal };
};
