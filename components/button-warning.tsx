"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
	mode: string;
	text: string;
}

export default function FormButton({ mode, text }: FormButtonProps) {
	const { pending } = useFormStatus();
	return (
		<button
			disabled={pending}
			className={`warning-btn h-10 p-2 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed`}
		>
			{pending ? "Loading..." : text}
		</button>
	);
}
