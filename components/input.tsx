import { InputHTMLAttributes } from "react";

interface InputProps {
	name: string;
	errors?: string[];
}

export default function Input({
	name,
	errors = [],
	...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
	return (
		<div className="flex flex-col gap-2">
			<input
				name={name}
				className="w-full h-10 pl-5 bg-transparent border-none rounded-2xl focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-500 placeholder:text-neutral-400"
				{...rest}
			/>
			{errors.map((error, index) => (
				<span key={index} className="text-red-500 font-medium">
					{error}
				</span>
			))}
		</div>
	);
}
