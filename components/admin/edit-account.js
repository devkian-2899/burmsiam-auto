"use client";

import { useSearchParams } from "next/navigation";
import { AdminShell } from "./shell";
import { UserForm } from "./user-form";
import { userById } from "../../content/admin-users";

export function EditAccount() {
  const params = useSearchParams();
  const user = userById(params.get("id") || "");

  return (
    <AdminShell>
      {user ? (
        <UserForm mode="edit" user={user} />
      ) : (
        <section className="admin-card">
          <h1>Account not found</h1>
          <p className="admin-lead">That sample account is not in this preview.</p>
        </section>
      )}
    </AdminShell>
  );
}
