import { Suspense } from "react";
import { ResetForm } from "../../../components/admin/reset-form";

export const metadata = {
  title: "Reset password · BurmSiamAuto",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="admin-status">Loading reset…</p>}>
      <ResetForm />
    </Suspense>
  );
}
