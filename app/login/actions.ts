"use server";

export async function handleForm(prevState: any, formData: FormData) {
	console.log("prevState: " + prevState);
	// await new Promise((resolve) => setTimeout(resolve, 5000));

	console.log("formData: " + formData);
	const password = formData.get("password");

	if (password === "12345") {
		return "Welcome back!";
	} else {
		return {
			errors: ["wrong password"],
		};
	}
}
