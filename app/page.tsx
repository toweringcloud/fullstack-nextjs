import Link from "next/link";
import { redirect } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/outline";

import Button from "@/components/button";
import { db } from "@/libs/db";
import getSession from "@/libs/session";

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
async function getTweets() {
	const tweets = await db.tweet.findMany({
		include: {
			user: {
				select: {
					username: true,
				},
			},
		},
		// take: 3,
		orderBy: {
			created_at: "desc",
		},
	});
	if (!tweets) return [];
	return tweets;
}

export default async function Home() {
	const user = await getUser();
	console.log("# user : " + user!.username);

	const tweets = await getTweets();
	console.log("# tweets : " + tweets.length);

	const viewProfile = async () => {
		"use server";
		redirect("/profile");
	};

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="text-3xl text-center pt-[10vh]">✨ Home ✨</div>
			<form action={viewProfile}>
				<Button mode="primary" text="Go to Profile" />
			</form>
			<h2>All Tweets</h2>
			<hr className="-mt-10 -mb-5" />
			<div className="flex flex-col gap-2">
				{tweets.map((item) => (
					<Link key={item.id} href={`/tweets/${item.id}`}>
						<div className="border rounded-md p-3 bg-gray-800 flex justify-between">
							<div className="flex flex-row gap-2">
								<UserIcon className="size-8" />
								{item.tweet}
							</div>
							<span className="text-gray-400">
								{item.created_at.toLocaleTimeString()}
							</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
