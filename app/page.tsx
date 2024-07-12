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
	const session = await getSession();
	const tweets = await db.tweet.findMany({
		where: {
			userId: session.id,
		},
		orderBy: {
			created_at: "desc",
		},
	});
	if (!tweets) return [];
	return tweets;
}

export default async function Home() {
	const user = await getUser();
	console.log(user);

	const tweets = await getTweets();
	console.log(tweets.length);

	const viewProfile = async () => {
		"use server";
		redirect("/profile");
	};

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="text-3xl text-center pt-10">✨ Home ✨</div>
			<form action={viewProfile}>
				<Button mode="primary" text="Go to Profile" />
			</form>
			<h2>All Tweets</h2>
			<hr className="-mt-10 -mb-5" />
			<div className="flex flex-col gap-2">
				{tweets.map((item) => (
					<Link href={`/tweets/${item.id}`}>
						<div
							key={item.id}
							className="border rounded-md p-3 bg-gray-800 flex justify-between"
						>
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
