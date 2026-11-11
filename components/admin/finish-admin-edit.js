"use client";

/** Full navigation so list pages and the next edit load fresh data. */
export function finishAdminEdit(indexPath) {
  window.location.assign(indexPath);
}
