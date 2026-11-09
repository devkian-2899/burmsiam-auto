"use client";

import Link from "next/link";
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
  const starting = user
    ? { ...empty, ...user, password: "", confirm: "" }
    : empty;
  const [values, setValues] = useState(starting);
  const [notice, setNotice] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function setField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    setNotice(mode === "edit" ? "Preview only. This account was not updated." : "Preview only. This account was not created.");
  }

  return (
    <form className="admin-card admin-form" onSubmit={onSubmit}>
      <h1>{mode === "edit" ? "Edit account" : "New account"}</h1>
      <div className="admin-fields">
        <label>
          <span>Name</span>
          <input name="name" value={values.name} onChange={setField} autoComplete="name" />
        </label>
        <label>
          <span>Username</span>
          <input name="username" value={values.username} onChange={setField} autoComplete="username" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" value={values.email} onChange={setField} autoComplete="email" />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" value={values.phone} onChange={setField} autoComplete="tel" />
        </label>
        <label>
          <span>Role</span>
          <select name="role" value={values.role} onChange={setField}>
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" value={values.password} onChange={setField} autoComplete="new-password" />
        </label>
        <label>
          <span>Confirm password</span>
          <input name="confirm" type="password" value={values.confirm} onChange={setField} autoComplete="new-password" />
        </label>
      </div>
      <div className="admin-actions">
        <button className="admin-button" type="submit">{mode === "edit" ? "Update" : "Create account"}</button>
        <Link className="admin-button admin-button-quiet" href="/admin/users">Cancel</Link>
        {mode === "edit" ? (
          <button className="admin-button admin-button-danger" type="button" onClick={() => setConfirmDelete(true)}>
            Delete
          </button>
        ) : null}
      </div>
      {notice ? <p className="admin-status">{notice}</p> : null}
      {confirmDelete ? (
        <div className="admin-confirm">
          <p>Delete this account? This preview will not remove it.</p>
          <div className="admin-actions">
            <button className="admin-button admin-button-danger" type="button" onClick={() => setNotice("Preview only. This account was not deleted.")}>
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
