import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import date from "date-fns";
import { db } from "../../db";
import { goals, goalCompletions } from "../../db/schema";
import { and, count, eq, gte, lte, sql, asc } from "drizzle-orm";

export const getWeekPendingGoals = async () => {
	const currentDate = new Date();

	const currentYear = date.getYear(currentDate);
	const currentWeek = date.getWeek(currentDate);

	const firstDayOfTheWeek = date.startOfWeek(currentDate);
	const lastDayOfTheWeek = date.endOfWeek(currentDate);

	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt,
			})
			.from(goals)
			.where(
				and(
					sql`EXTRACT(YEAR FROM ${goals.createdAt}) <= ${currentYear}`,
					sql`EXTRACT(WEEK FROM ${goals.createdAt}) <= ${currentWeek}`,
				),
			),
	);

	const goalCompletionCounts = db.$with("goal_completion_counts").as(
		db
			.select({
				goalId: goals.id,
				completionCount: count(goalCompletions.id).as("completionCount"),
			})
			.from(goalCompletions)
			.innerJoin(goals, eq(goals.id, goalCompletions.goalId))
			.groupBy(goals.id),
	);

	const pendingGoals = await db
		.with(goalsCreatedUpToWeek, goalCompletionCounts)
		.select({
			id: goalsCreatedUpToWeek.id,
			title: goalsCreatedUpToWeek.title,
			desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
			completionCount:
				sql /*sql*/`COALESCE(${goalCompletionCounts.completionCount}, 0)`.mapWith(
					Number,
				),
		})
		.from(goalsCreatedUpToWeek)
		.orderBy(asc(goalsCreatedUpToWeek.createdAt))

		.leftJoin(
			goalCompletionCounts,
			eq(goalsCreatedUpToWeek.id, goalCompletionCounts.goalId),
		);

	return {
		pendingGoals,
	};
};
