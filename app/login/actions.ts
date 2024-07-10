"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcrypt";

import {
	EMAIL_NOT_ALLOWED_ERROR,
	PASSWORD_MIN_LENGTH,
	PASSWORD_MIN_LENGTH_ERROR,
	PASSWORD_REGEX,
	PASSWORD_REGEX_ERROR,
	USERNAME_MIN_LENGTH,
	USERNAME_MIN_LENGTH_ERROR,
} from "@/libs/constants";
import { db } from "@/libs/db";
import getSession from "@/libs/session";

const checkEmailExists = async (email: string) => {
	const user = await db.user.findUnique({
		where: {
			email,
		},
		select: {
			id: true,
		},
	});
	return Boolean(user);
};

const formSchema = z.object({
	email: z
		.string()
		.toLowerCase()
		.refine((i) => i.includes("@zod.com"), EMAIL_NOT_ALLOWED_ERROR),
	username: z
		.string()
		.refine(
			(i) => i.length >= USERNAME_MIN_LENGTH,
			USERNAME_MIN_LENGTH_ERROR
		),
	password: z
		.string()
		.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
		.refine(
			(i) => i.length >= PASSWORD_MIN_LENGTH,
			PASSWORD_MIN_LENGTH_ERROR
		),
});

export async function logIn(prevState: any, formData: FormData) {
	const data = {
		email: formData.get("email"),
		username: formData.get("username"),
		password: formData.get("password"),
	};
	const result = await formSchema.spa(data);
	if (!result.success) {
		return result.error.flatten();
	} else {
		const user = await db.user.findUnique({
			where: {
				email: result.data.email,
			},
			select: {
				id: true,
				password: true,
			},
		});
		const ok = await bcrypt.compare(
			result.data.password,
			user!.password ?? ":::__:::"
		);
		if (ok) {
			const session = await getSession();
			session.id = user!.id;
			await session.save();
			redirect("/profile");
		} else {
			return {
				fieldErrors: {
					password: ["Wrong password."],
					email: [],
				},
			};
		}
	}
}
