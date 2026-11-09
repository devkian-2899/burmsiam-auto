import { AdminShell } from "../../../components/admin/shell";
import { UserTable } from "../../../components/admin/user-table";

export const metadata = {
  title: "Accounts · BurmSiamAuto",
};

export default function AccountsPage() {
  return (
    <AdminShell>
      <UserTable />
    </AdminShell>
  );
}
