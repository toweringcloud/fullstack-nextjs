"use server";

import { revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
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

export async function getTweet(id) {
	try {
		const tweet = await db.tweet.update({
			where: {
				id,
			},
			data: {
				views: {
					increment: 1,
				},
			},
			include: {
				user: {
					select: {
						username: true,
					},
				},
				_count: {
					select: {
						comments: true,
						likes: true,
					},
				},
			},
		});
		return tweet;
	} catch (e) {
		return notFound;
	}
}

export async function getIsLiked(tweetId: number) {
	const session = await getSession();
	const like = await db.like.findUnique({
		where: {
			cid: {
				tweetId,
				userId: session.id!,
			},
		},
	});
	return like == null ? false : true;
}

export async function getLikeStatus(tweetId: number) {
	const isLiked = await getIsLiked(tweetId);
	const likeCount = await db.like.count({
		where: {
			tweetId,
		},
	});
	console.log("# getLikeStatus: " + likeCount);
	return {
		likeCount,
		isLiked,
	};
}

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

export async function getCommentCount() {
	const commentCount = await db.comment.count({});
	if (!commentCount) return 0;
	return commentCount;
}

export async function getComments(count: number, page: number) {
	const comments = await db.comment.findMany({
		select: {
			id: true,
			payload: true,
			created_at: true,
		},
		skip: count * page,
		take: count,
		orderBy: {
			created_at: "desc",
		},
	});
	if (!comments) return [];
	return comments;
}

const formSchema = z.object({
	payload: z.string({ required_error: "Comment is required!" }),
});

export async function addComment(prevState: any, formData: FormData) {
	//-validate user input
	const data = {
		payload: formData.get("payload"),
		tweetId: formData.get("tweetId") as string,
	};
	console.log(JSON.stringify(formData));
	const result = await formSchema.spa(data);
	if (!result.success) {
		return result.error.flatten();
	}

	//-add user's comment
	const session = await getSession();
	if (session.id && data.tweetId) {
		await db.comment.create({
			data: {
				payload: result.data.payload,
				user: {
					connect: {
						id: session.id,
					},
				},
				tweet: {
					connect: {
						id: parseInt(data.tweetId),
					},
				},
			},
			select: {
				id: true,
			},
		});
		redirect(`/tweets/${data.tweetId}`);
	}
}
