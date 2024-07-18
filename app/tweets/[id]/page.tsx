import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { EyeIcon, HandThumbUpIcon, UserIcon } from "@heroicons/react/24/solid";

import Button from "@/components/button";
import { db } from "@/libs/db";
import getSession from "@/libs/session";
import { formatToTimeAgo } from "@/libs/utils";

async function getUser() {
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

async function getTweet(id) {
	try {
		const tweet = await db.tweet.update({
			where: {
				id: parseInt(id),
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
		return null;
	}
}

async function getIsLiked(tweetId: number) {
	const session = await getSession();
	const like = await db.like.findUnique({
		where: {
			cid: {
				tweetId,
				userId: session.id!,
			},
		},
	});
	return Boolean(like);
}

export default async function Detail({ params }) {
	const user = await getUser();
	console.log("# user : " + user!.username);

	const id = Number(params.id);
	if (isNaN(id)) {
		return notFound();
	}

	const item = await getTweet(id);
	if (!item) {
		return notFound();
	}
	console.log("# tweet : " + item!.payload);

	const likeTweet = async () => {
		"use server";
		const session = await getSession();
		try {
			await db.like.create({
				data: {
					tweetId: id,
					userId: session.id!,
				},
			});
			revalidatePath(`/post/${id}`);
		} catch (e) {}
	};
	const isLiked = await getIsLiked(id);

	const dislikeTweet = async () => {
		"use server";
		try {
			const session = await getSession();
			await db.like.delete({
				where: {
					cid: {
						tweetId: id,
						userId: session.id!,
					},
				},
			});
			revalidatePath(`/post/${id}`);
		} catch (e) {}
	};

	const goHome = async () => {
		"use server";
		redirect("/");
	};

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="text-3xl text-center pt-[30vh]">✨ Detail ✨</div>
			<form action={goHome}>
				<Button mode="primary" text="Go to Home" />
			</form>
			<h2>Tweet Info ({item?.id})</h2>
			<hr className="-mt-10 -mb-5" />
			<div className="flex flex-col gap-2 text-gray-400">
				<span className="mb-2">{item?.payload}</span>
				<div className="flex justify-between items-start *:flex *:gap-2 -mb-4">
					<span className="text-pretty">
						<UserIcon className="size-5" />
						{item?.user.username}
					</span>
					<span>{formatToTimeAgo(item?.created_at.toString())}</span>
				</div>
			</div>
			<hr className="-mt-5 -mb-8" />
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-2 text-neutral-400 text-sm">
					<EyeIcon className="size-5" />
					<span>조회 {item.views}</span>
				</div>
				<form action={isLiked ? dislikeTweet : likeTweet}>
					<button
						className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 hover:bg-neutral-800 transition-colors`}
					>
						<HandThumbUpIcon className="size-5" />
						<span>공감하기 ({item._count.likes})</span>
					</button>
				</form>
			</div>
		</div>
	);
}
