import { redirect } from "next/navigation";

import Button from "@/components/button";
import TextArea from "@/components/textarea";
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
			id: session.id,
		},
	});
	if (tweets) {
		return tweets;
	}
}

export default async function Home() {
	const user = await getUser();
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
			<hr className="-mt-10" />
		</div>
	);
}
