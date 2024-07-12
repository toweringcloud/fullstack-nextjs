import { redirect } from "next/navigation";
import Link from "next/link";

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

export default async function Home() {
	const user = await getUser();

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="text-3xl text-center pt-10">✨ Home ✨</div>
			<h2>Tweets</h2>
		</div>
	);
}
