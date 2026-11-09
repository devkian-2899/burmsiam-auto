"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export function RecordList({
  title,
  lead,
  endpoint,
  collection,
  newHref,
  editBase,
  columns,
  searchPlaceholder,
  empty,
  renderRow,
}) {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");
  const [sort, setSort] = useState({ key: columns[0].key, direction: "asc" });
  const [pendingDelete, setPendingDelete] = useState("");

  useEffect(() => {
    let active = true;
    fetch(endpoint)
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!active) return;
        if (!response.ok) {
          setStatus("error");
          setMessage(body.error || "The list could not be loaded.");
          return;
        }
        setRows(body[collection] || []);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
        setMessage("The list could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, [collection, endpoint]);

  const visible = useMemo(() => {
    const needle = applied.trim().toLowerCase();
    const next = rows.filter((row) => {
      if (!needle) return true;
      return columns.some((column) => String(row[column.key] || "").toLowerCase().includes(needle));
    });
    next.sort((a, b) => {
      const result = String(a[sort.key] || "").localeCompare(String(b[sort.key] || ""), undefined, { numeric: true });
      return sort.direction === "asc" ? result : -result;
    });
    return next;
  }, [applied, columns, rows, sort]);

  function toggleSort(key) {
    setSort((current) => (
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    ));
  }

  async function remove(id) {
    const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(body.error || "It was not deleted.");
      setPendingDelete("");
      return;
    }
    setRows((current) => current.filter((item) => item.id !== id));
    setMessage("");
    setPendingDelete("");
  }

  return (
    <section className="admin-card">
      <div className="admin-heading">
        <div>
          <h1>{title}</h1>
          {lead ? <p className="admin-lead">{lead}</p> : null}
        </div>
        <Link className="admin-button" href={newHref}>New</Link>
      </div>
      <form className="admin-filters" onSubmit={(event) => { event.preventDefault(); setApplied(query); }}>
        <label>
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} />
        </label>
        <button className="admin-button" type="submit">Search</button>
      </form>
      {status === "loading" ? <p className="admin-status">Loading…</p> : null}
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
                <td className="admin-empty" colSpan={columns.length + 1}>{empty}</td>
              </tr>
            ) : visible.map((row) => (
              <tr key={row.id}>
                {renderRow(row)}
                <td>
                  <div className="admin-row-actions">
                    <Link href={`${editBase}?id=${row.id}`}>Edit</Link>
                    {pendingDelete === row.id ? (
                      <>
                        <button type="button" onClick={() => remove(row.id)}>Confirm</button>
                        <button type="button" onClick={() => setPendingDelete("")}>Cancel</button>
                      </>
                    ) : (
                      <button className="admin-text-danger" type="button" onClick={() => setPendingDelete(row.id)}>Delete</button>
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
