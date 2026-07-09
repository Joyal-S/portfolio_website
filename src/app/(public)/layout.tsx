import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSiteSettings } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const name = settings.name;

  return (
    <>
      <Header name={name} />
      <main className="min-h-screen">{children}</main>
      <Footer name={name} />
    </>
  );
}
