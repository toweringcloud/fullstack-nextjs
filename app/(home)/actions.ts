"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/libs/db";
import getSession from "@/libs/session";

export async function getUser() {
	const session = await getSession();
	if (session.id) {
		const user = await db.user.findUnique({
			where: {
				id: session.id,
			},
		});
		if (user) {
			return user;
		}
	}
	redirect("/login");
}

export async function getTweetCount() {
	const tweetCount = await db.tweet.count({});
	if (!tweetCount) return 0;
	return tweetCount;
}

export async function getTweets(count: number, page: number) {
	const tweets = await db.tweet.findMany({
		select: {
			id: true,
			payload: true,
			views: true,
			created_at: true,
			_count: {
				select: {
					comments: true,
					likes: true,
				},
			},
		},
		skip: count * page,
		take: count,
		orderBy: {
			created_at: "desc",
		},
	});
	if (!tweets) return [];
	return tweets;
}

const formSchema = z.object({
	payload: z.string({ required_error: "Tweet is required!" }),
});

export async function addTweet(prevState: any, formData: FormData) {
	//-validate user input
	const data = {
		payload: formData.get("payload"),
	};
	const result = await formSchema.spa(data);
	if (!result.success) {
		return result.error.flatten();
	}

	//-add user's tweet
	const session = await getSession();
	if (session.id) {
		await db.tweet.create({
			data: {
				payload: result.data.payload,
				user: {
					connect: {
						id: session.id,
					},
				},
			},
			select: {
				id: true,
			},
		});
		redirect("/");
	}
}
