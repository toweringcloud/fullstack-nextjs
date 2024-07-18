"use client";

import { useFormState } from "react-dom";

import Button from "@/components/button";
import Input from "@/components/input";

export default function AddTweet({ action }: any) {
	const [state, dispatch] = useFormState(action, null);
	return (
		<form action={dispatch} className="p-0 flex flex-col gap-5">
			<Input
				name="payload"
				required
				placeholder="Add your tweet!"
				type="text"
				// errors={state?.fieldErrors.title}
			/>
			<Button mode="primary" text="Upload Tweet" />
		</form>
	);
}
