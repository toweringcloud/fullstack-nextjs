"use client";

import Link from "next/link";
import { useFormState } from "react-dom";

import Button from "@/components/button";
import Input from "@/components/input";

import { createAccount } from "./actions";

export default function CreateAccount() {
	const [state, dispatch] = useFormState(createAccount, null);

	return (
		<div className="h-screen flex justify-center items-center">
			<div className="flex flex-col gap-10 py-8 px-6 mx-[15%] min-w-[450px]">
				<div className="text-3xl text-center">✨ Sign-up ✨</div>
				<form action={dispatch} className="flex flex-col gap-3">
					<Input
						name="username"
						type="text"
						placeholder="Username"
						required
						errors={state?.fieldErrors.username}
						minLength={5}
						maxLength={15}
					/>
					<Input
						name="email"
						type="email"
						placeholder="Email"
						required
						errors={state?.fieldErrors.email}
					/>
					<Input
						name="password"
						type="password"
						placeholder="Password"
						minLength={5}
						required
						errors={state?.fieldErrors.password}
					/>
					<Input
						name="confirm_password"
						type="password"
						placeholder="Confirm Password"
						required
						minLength={5}
						errors={state?.fieldErrors.confirm_password}
					/>
					<Button mode="primary" text="Create account" />
				</form>
				<hr className="-mt-5 -mb-5" />
				<Link href="/login">
					<Button mode="primary" text="Sign-in" />
				</Link>
			</div>
		</div>
	);
}
