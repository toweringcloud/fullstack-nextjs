import { redirect } from "next/navigation";

import Button from "@/components/button";
// import TextArea from "@/components/textarea";
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
	const viewProfile = async () => {
		"use server";
		redirect("/profile");
	};

	const tweets = await getTweets();
	console.log(tweets.length);

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
					<div
						key={item.id}
						className="border rounded-md p-5 bg-gray-800 flex justify-between"
					>
						<span>{item.tweet}</span>
						<span className="text-gray-400">
							{item.created_at.toLocaleTimeString()}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
