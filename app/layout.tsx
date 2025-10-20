
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryClientProviderComponent from "./components/common/queryClientProvider";
import { AuthProvider } from "./contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JB HI-FI Store - Always Cheap Prices",
  description: "Discover amazing deals on electronics, computers, phones, and more at JB HI-FI. Always cheap prices guaranteed!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProviderComponent>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProviderComponent>
      </body>
    </html>
  );
}
