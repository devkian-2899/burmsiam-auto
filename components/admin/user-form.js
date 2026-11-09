"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { roles } from "../../content/admin-users";

const empty = {
  name: "",
  username: "",
  email: "",
  phone: "",
  role: "",
  password: "",
  confirm: "",
};

export function UserForm({ mode, user }) {
  const router = useRouter();
  const starting = user ? { ...empty, ...user, password: "", confirm: "" } : empty;
  const [values, setValues] = useState(starting);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function setField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setNotice("");
    setPending(true);
    const response = await fetch(mode === "edit" ? `/api/admin/staff/${user.id}` : "/api/admin/staff", {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setNotice(body.error || "The account was not saved.");
      return;
    }
    if (mode === "edit") {
      router.push("/admin/users");
      router.refresh();
      return;
    }
    setValues(empty);
    setNotice("Saved. You can add another.");
  }

  async function removeAccount() {
    setNotice("");
    const response = await fetch(`/api/admin/staff/${user.id}`, { method: "DELETE" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setNotice(body.error || "The account was not deleted.");
      setConfirmDelete(false);
      return;
    }
    router.push("/admin/users");
    router.refresh();
  }

  return (
    <form className="admin-card admin-form" onSubmit={onSubmit}>
      <h1>{mode === "edit" ? "Edit account" : "New account"}</h1>
      <div className="admin-fields">
        <label>
          <span>Name</span>
          <input name="name" value={values.name} onChange={setField} autoComplete="name" required />
        </label>
        <label>
          <span>Username</span>
          <input name="username" value={values.username} onChange={setField} autoComplete="username" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" value={values.email} onChange={setField} autoComplete="email" required />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" value={values.phone} onChange={setField} autoComplete="tel" />
        </label>
        <label>
          <span>Role</span>
          <select name="role" value={values.role} onChange={setField} required>
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Password</span>
          <input
            name="password"
            type="password"
            value={values.password}
            onChange={setField}
            autoComplete="new-password"
            placeholder={mode === "edit" ? "Leave blank to keep the current password" : ""}
            required={mode !== "edit"}
          />
        </label>
        <label>
          <span>Confirm password</span>
          <input name="confirm" type="password" value={values.confirm} onChange={setField} autoComplete="new-password" required={mode !== "edit" || values.password.length > 0} />
        </label>
      </div>
      <div className="admin-actions">
        <button className="admin-button" type="submit" disabled={pending}>{mode === "edit" ? "Update" : "Create account"}</button>
        {mode === "edit" ? <Link className="admin-button admin-button-quiet" href="/admin/users">Cancel</Link> : null}
        {mode === "edit" ? (
          <button className="admin-button admin-button-danger" type="button" onClick={() => setConfirmDelete(true)}>
            Delete
          </button>
        ) : null}
      </div>
      {notice ? <p className="admin-status">{notice}</p> : null}
      {mode === "edit" ? null : <Link className="admin-button admin-button-quiet" href="/admin/users">Back to index</Link>}
      {confirmDelete ? (
        <div className="admin-confirm">
          <p>Delete this account? The person will no longer be able to sign in.</p>
          <div className="admin-actions">
            <button className="admin-button admin-button-danger" type="button" onClick={removeAccount}>
              Delete
            </button>
            <button className="admin-button admin-button-quiet" type="button" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
