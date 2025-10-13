import type { Metadata } from "next";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

export const metadata: Metadata = {
  title: "Cast Stone Admin - Dashboard",
  description: "Admin dashboard for Cast Stone management",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<div>      <div className="antialiased bg-gray-50">
        <AdminAuthProvider>
          {children}
        </AdminAuthProvider>
      </div>
</div>  );
}
