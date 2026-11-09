import { redirect } from "next/navigation";
import { currentStaff } from "../../lib/auth.mjs";
import { AdminShell } from "./shell";

export async function PanelFrame({ children }) {
  const staff = await currentStaff();
  if (!staff) redirect("/admin");
  return <AdminShell>{children}</AdminShell>;
}
