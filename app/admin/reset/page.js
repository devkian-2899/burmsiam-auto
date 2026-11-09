import { redirect } from "next/navigation";

export default async function ResetRedirect({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === "string" ? params.token : "";
  redirect(token ? `/login/reset?token=${encodeURIComponent(token)}` : "/login/reset");
}