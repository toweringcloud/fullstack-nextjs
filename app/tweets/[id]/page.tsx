import { redirect } from "next/navigation";

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
async function getTweet(id) {
	const tweet = await db.tweet.findUnique({
		where: {
			id: parseInt(id),
		},
	});
	if (!tweet) return null;
	return tweet;
}

export default async function Detail({ params }) {
	const user = await getUser();
	console.log(user);

	const item = await getTweet(params.id);
	console.log(item);

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
			<h2>Tweet Info</h2>
			<hr className="-mt-10 -mb-5" />
			<div className="flex flex-col gap-2 text-gray-400">
				<span>- 트윗 번호 : {item?.id}</span>
				<span>- 트윗 내용 : {item?.tweet}</span>
				<span>
					- 트윗 일시 : {item?.created_at.toLocaleTimeString()}
				</span>
			</div>
		</div>
	);
}
