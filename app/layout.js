import "./globals.css";

export const metadata = {
  title: "Reverse Factor Knowledge Quiz",
  description: "Test your knowledge of the Reverse Factor health & lifestyle concepts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
