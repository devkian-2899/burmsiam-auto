import { Suspense } from "react";
import { EditAccount } from "../../../../../components/admin/edit-account";

export const metadata = {
  title: "Edit account · BurmSiamAuto",
};

export default function EditAccountPage() {
  return (
    <Suspense fallback={<p className="admin-status">Loading account…</p>}>
      <EditAccount />
    </Suspense>
  );
}
