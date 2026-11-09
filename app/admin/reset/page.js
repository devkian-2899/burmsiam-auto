import { redirect } from "next/navigation";

export default function ResetRedirect() {
  redirect("/login/reset");
}
