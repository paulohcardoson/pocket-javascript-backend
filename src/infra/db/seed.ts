import date from "date-fns";
import { client, db } from ".";
import * as schema from "./schema";

const seed = async () => {
	await db.delete(schema.goalCompletions);
	await db.delete(schema.goals);

	const goals = await db
		.insert(schema.goals)
		.values([
			{
				title: "Study for the assignment",
				desiredWeeklyFrequency: 5,
			},
			{
				title: "Create a new blog post",
				desiredWeeklyFrequency: 2,
			},
			{
				title: "Excercise",
				desiredWeeklyFrequency: 5,
			},
		])
		.returning();

	const startOfWeek = date.startOfWeek(new Date());

	await db.insert(schema.goalCompletions).values([
		{
			goalId: goals[0].id,
			createdAt: startOfWeek,
		},
		{
			goalId: goals[1].id,
			createdAt: date.addDays(startOfWeek, 1),
		},
	]);
};

seed().finally(() => client.end());
