import "./globals.css";

export const metadata = {
  title: "StateJet Ecommerce Example",
  description: "A premium ecommerce example built with StateJet and Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
