import { BASE_API } from "./utils";

export type RegisterUserInput = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

export async function registerUser(input: RegisterUserInput): Promise<void> {
  const response = await fetch(`${BASE_API}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Unable to register. Please check your details and try again.");
  }
}
