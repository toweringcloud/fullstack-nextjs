"use server";

import { revalidateTag } from "next/cache";

import { db } from "@/libs/db";
import getSession from "@/libs/session";

export async function likeTweet(tweetId: number) {
	await new Promise((r) => setTimeout(r, 1000));
	const session = await getSession();
	try {
		await db.like.create({
			data: {
				tweetId,
				userId: session.id!,
			},
		});
		revalidateTag(`like-status-${tweetId}`);
	} catch (e) {}
}

export async function dislikeTweet(tweetId: number) {
	await new Promise((r) => setTimeout(r, 1000));
	try {
		const session = await getSession();
		await db.like.delete({
			where: {
				cid: {
					tweetId,
					userId: session.id!,
				},
			},
		});
		revalidateTag(`like-status-${tweetId}`);
	} catch (e) {}
}
