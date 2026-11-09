import { AdminShell } from "../../../../components/admin/shell";
import { UserForm } from "../../../../components/admin/user-form";

export const metadata = {
  title: "New account · BurmSiamAuto",
};

export default function NewAccountPage() {
  return (
    <AdminShell>
      <UserForm mode="create" />
    </AdminShell>
  );
}
