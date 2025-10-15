import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as any)?.role as string | undefined;
  if (!session || role !== "admin") {
    redirect("/login?next=/admin");
  }
  return <>{children}</>;
}
