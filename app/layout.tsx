import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "hi",
  description: "would you let me pamper you?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
