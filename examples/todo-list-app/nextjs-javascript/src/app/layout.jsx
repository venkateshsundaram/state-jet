import "./globals.css";

export const metadata = {
  title: "StateJet Todo List Example",
  description: "A premium todo list example built with StateJet and Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
