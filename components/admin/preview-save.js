"use client";

import { useState } from "react";

export function PreviewSave({ children, label = "Save" }) {
  const [note, setNote] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    setNote("Preview only. Nothing was saved.");
  }

  return (
    <form onSubmit={onSubmit}>
      {children}
      <button className="admin-button" type="submit">{label}</button>
      {note ? <p className="admin-status">{note}</p> : null}
    </form>
  );
}
