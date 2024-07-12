"use server";

import { redirect } from "next/navigation";

import { db } from "@/libs/db";
import getSession from "@/libs/session";

export async function viewProfile() {
	redirect("/profile");
}

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

export async function getInitialTweets(count: number) {
	const tweets = await db.tweet.findMany({
		include: {
			user: {
				select: {
					username: true,
				},
			},
		},
		take: count,
		orderBy: {
			created_at: "desc",
		},
	});
	if (!tweets) return [];
	return tweets;
}

export async function getMoreTweets(page: number, count: number) {
	const tweets = await db.tweet.findMany({
		include: {
			user: {
				select: {
					username: true,
				},
			},
		},
		skip: page * count,
		take: count,
		orderBy: {
			created_at: "desc",
		},
	});
	if (!tweets) return [];
	return tweets;
}
