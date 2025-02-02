"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
	mode: string;
	text: string;
}

export default function Button({ mode, text }: ButtonProps) {
	const { pending } = useFormStatus();
	return (
		<button
			disabled={pending}
			className={`${mode}-btn h-10 p-2 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed`}
		>
			{pending ? "Loading..." : text}
		</button>
	);
}
