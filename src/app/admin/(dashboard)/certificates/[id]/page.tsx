import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CertificateForm } from "./certificate-form";

interface Props {
  params: { id: string };
}

async function getCertificate(id: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export default async function AdminCertificateEditPage({ params }: Props) {
  const isNew = params.id === "new";
  let certificate = null;

  if (!isNew) {
    certificate = await getCertificate(params.id);
    if (!certificate) notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {isNew ? "New Certificate" : "Edit Certificate"}
        </h1>
      </div>

      <CertificateForm certificate={certificate} isNew={isNew} />
    </div>
  );
}
