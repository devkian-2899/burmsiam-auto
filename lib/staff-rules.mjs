import { ROLES } from "./auth.mjs";

export function validateStaff(body, { passwordRequired }) {
  const name = String(body.name || "").trim();
  const username = String(body.username || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const role = String(body.role || "").trim();
  const password = String(body.password || "");
  const confirm = String(body.confirm || "");

  if (!name || !username || !email || !role) return { error: "Name, username, email, and role are required." };
  if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username)) return { error: "Username needs 3 to 40 letters, numbers, dots, or dashes." };
  if (!email.includes("@") || email.startsWith("@") || email.endsWith("@")) return { error: "Enter a real email." };
  if (!ROLES.includes(role)) return { error: "Choose a role." };
  if (passwordRequired || password || confirm) {
    if (password.length < 8) return { error: "Use at least 8 characters." };
    if (password !== confirm) return { error: "The passwords do not match." };
  }
  return { name, username, email, phone, role, password };
}
