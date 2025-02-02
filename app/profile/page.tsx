import { notFound, redirect } from "next/navigation";

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
	notFound();
}

export default async function Profile() {
	const user = await getUser();
	console.log(user!.username);

	const goHome = async () => {
		"use server";
		redirect("/");
	};
	const logOut = async () => {
		"use server";
		const session = await getSession();
		await session.destroy();
		redirect("/");
	};

	return (
		<div className="h-screen flex justify-center items-center">
			<div className="flex flex-col gap-10 py-8 px-6 mx-[15%] min-w-[450px]">
				<div className="text-3xl text-center">✨ Profile ✨</div>
				<h1 className="text-center">
					<span>::::: Welcome, </span>
					<span className="text-blue-300 text-lg font-semibold">
						{user?.username}
					</span>
					<span>! Feel free to add your tweets. :::::</span>
				</h1>
				<form action={goHome} className="-mb-5">
					<Button mode="primary" text="Go to Home" />
				</form>
				<form action={logOut}>
					<Button mode="primary" text="Log out" />
				</form>
			</div>
		</div>
	);
}
