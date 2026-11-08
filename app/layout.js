import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata = {
  title: "BurmSiamAuto",
  description: "Uniting Automobile Lovers Everywhere",
  icons: {
    icon: [{ url: "/images/main/bsicon.png", type: "image/png" }],
    apple: "/images/main/bsicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
