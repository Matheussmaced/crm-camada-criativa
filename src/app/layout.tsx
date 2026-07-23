import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/contexts/AppProviders";
import { ConfirmProvider } from "@/hooks/useConfirm";
import { Toaster } from "@/components/ui/Toaster";
import { STORAGE_KEYS } from "@/services/storage/keys";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM Impressão 3D",
  description: "CRM completo para gestão de orçamentos, clientes e financeiro de uma empresa de impressão 3D.",
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem(${JSON.stringify(STORAGE_KEYS.settings)});
    var theme = raw ? JSON.parse(raw).theme : "system";
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = theme === "dark" || (theme !== "light" && prefersDark);
    if (isDark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="h-full font-sans">
        <AppProviders>
          <ConfirmProvider>
            {children}
            <Toaster />
          </ConfirmProvider>
        </AppProviders>
      </body>
    </html>
  );
}
