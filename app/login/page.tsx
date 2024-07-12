"use client";

import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

import Button from "@/components/button";
import Input from "@/components/input";
import { logIn } from "./actions";

export default function LogIn() {
	const [state, dispatch] = useFormState(logIn, null);
	const params = useSearchParams();
	console.log(params);

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="text-3xl text-center pt-[30vh]">✨ Sign-in ✨</div>
			<form action={dispatch} className="flex flex-col gap-3">
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
					required
					errors={state?.fieldErrors.password}
				/>
				<Button text="Verify account" />
				{params && state?.fieldErrors.length == 0 ? (
					<div className="bg-[#32BD6F] text-black font-semibold rounded-xl h-10 p-2 flex flex-row gap-3">
						<CheckBadgeIcon className="size-6" />
						Welcome back!
					</div>
				) : null}
			</form>
		</div>
	);
}
