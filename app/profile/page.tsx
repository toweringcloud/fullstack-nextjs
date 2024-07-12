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
	const logOut = async () => {
		"use server";
		const session = await getSession();
		await session.destroy();
		redirect("/");
	};

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="text-3xl text-center pt-[30vh]">✨ Profile ✨</div>
			<h1>::::: Welcome, {user?.username} :::::</h1>
			<form action={logOut}>
				<Button text="Log out" />
			</form>
		</div>
	);
}
