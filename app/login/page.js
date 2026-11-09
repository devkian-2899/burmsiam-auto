import { Suspense } from "react";
import { LoginForm } from "../../components/admin/login-form";

export const metadata = {
  title: "Log in · BurmSiamAuto",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="admin-status">Loading sign-in…</p>}>
      <LoginForm />
    </Suspense>
  );
}
