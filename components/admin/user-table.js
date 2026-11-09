"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { roles } from "../../content/admin-users";

const columns = [
  { key: "name", label: "Name" },
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "role", label: "Role" },
];

export function UserTable() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [applied, setApplied] = useState({ query: "", role: "" });
  const [sort, setSort] = useState({ key: "name", direction: "asc" });
  const [pendingDelete, setPendingDelete] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/staff")
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!active) return;
        if (!response.ok) {
          setStatus("error");
          setMessage(body.error || "The accounts could not be loaded.");
          return;
        }
        setRows(body.staff || []);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
        setMessage("The accounts could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const needle = applied.query.trim().toLowerCase();
    const next = rows.filter((user) => {
      const matchesRole = !applied.role || user.role === applied.role;
      const haystack = `${user.name} ${user.username} ${user.email} ${user.phone} ${user.role}`.toLowerCase();
      return matchesRole && (!needle || haystack.includes(needle));
    });
    next.sort((a, b) => {
      const result = String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true });
      return sort.direction === "asc" ? result : -result;
    });
    return next;
  }, [applied, rows, sort]);

  function onSearch(event) {
    event.preventDefault();
    setApplied({ query, role });
  }

  function toggleSort(key) {
    setSort((current) => (
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    ));
  }

  async function remove(id) {
    const response = await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(body.error || "The account was not deleted.");
      setPendingDelete("");
      return;
    }
    setRows((current) => current.filter((item) => item.id !== id));
    setPendingDelete("");
  }

  return (
    <section className="admin-card">
      <div className="admin-heading">
        <h1>Accounts</h1>
        <Link className="admin-button" href="/admin/users/new">New account</Link>
      </div>
      <form className="admin-filters" onSubmit={onSearch}>
        <label>
          <span>Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, username, email, or phone"
          />
        </label>
        <label>
          <span>Role</span>
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="">All roles</option>
            {roles.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <button className="admin-button" type="submit">Search</button>
      </form>
      {status === "loading" ? <p className="admin-status">Loading accounts…</p> : null}
      {status === "error" ? <p className="admin-status">{message}</p> : null}
      {message && status === "ready" ? <p className="admin-status">{message}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => {
                const active = sort.key === column.key;
                const mark = active ? (sort.direction === "asc" ? "↑" : "↓") : "";
                return (
                  <th key={column.key} aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}>
                    <button type="button" onClick={() => toggleSort(column.key)}>
                      {column.label} <span aria-hidden="true">{mark}</span>
                    </button>
                  </th>
                );
              })}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {status === "ready" && visible.length === 0 ? (
              <tr>
                <td className="admin-empty" colSpan={6}>No accounts match this search.</td>
              </tr>
            ) : visible.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <div className="admin-row-actions">
                    <Link href={`/admin/users/edit?id=${user.id}`}>Edit</Link>
                    {pendingDelete === user.id ? (
                      <>
                        <button type="button" onClick={() => remove(user.id)}>Confirm</button>
                        <button type="button" onClick={() => setPendingDelete("")}>Cancel</button>
                      </>
                    ) : (
                      <button className="admin-text-danger" type="button" onClick={() => setPendingDelete(user.id)}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
