import { InputHTMLAttributes } from "react";

interface InputProps {
	name: string;
	text: string;
	errors?: string[];
}

export default function TextArea({
	name,
	text,
	errors = [],
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
	return (
		<div className="flex flex-col gap-2">
			<textarea
				name={name}
				className="bg-transparent rounded-2xl w-full h-10 pl-5 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-500 border-none placeholder:text-neutral-400"
			>
				{text}
			</textarea>
			{errors.map((error, index) => (
				<span key={index} className="text-red-500 font-medium">
					{error}
				</span>
			))}
		</div>
	);
}
