import Link from "next/link";
import { Plus } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AdminCertificateList } from "./certificate-list";

export const dynamic = "force-dynamic";

async function getCertificates() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .order("issue_date", { ascending: false });

  return data ?? [];
}

export default async function AdminCertificatesPage() {
  const certificates = await getCertificates();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certificates</h1>
          <p className="text-muted-foreground mt-1">
            Manage your certificates and credentials.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/certificates/new">
            <Plus className="h-4 w-4 mr-2" />
            New Certificate
          </Link>
        </Button>
      </div>

      <AdminCertificateList certificates={certificates} />
    </div>
  );
}
