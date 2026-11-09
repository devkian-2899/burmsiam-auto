export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.BURMSIAM_MAIL_FROM?.trim());
}

export async function sendResetEmail({ to, link }) {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.BURMSIAM_MAIL_FROM?.trim();
  if (!key || !from) {
    throw new Error("Reset email is not connected.");
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Reset your BurmSiamAuto password",
      text: `A password reset was requested for this staff account.\n\nOpen this link within one hour:\n${link}\n\nIf you did not ask for this, you can ignore the email.`,
    }),
  });
  if (!response.ok) {
    throw new Error("The reset email could not be sent.");
  }
}
