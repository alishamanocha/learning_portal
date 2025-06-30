import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/app/components/Navbar/Navbar";

export const metadata = {
  title: "My Learning Portal",
  description: "A learning platform for middle and high school students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <main className="p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
