"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { deleteCertificate } from "@/features/admin/actions";
import { toast } from "sonner";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
}

export function AdminCertificateList({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteCertificate(id);
      toast.success("Certificate deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete certificate");
    }
  };

  if (certificates.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-muted-foreground mb-4">
          No certificates yet.
        </p>
        <Button asChild>
          <Link href="/admin/certificates/new">Add Certificate</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-medium text-muted-foreground">
                Title
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">
                Issuer
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">
                Date
              </th>
              <th className="text-right p-4 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr
                key={cert.id}
                className="border-b border-border/50 hover:bg-accent/50 transition-colors"
              >
                <td className="p-4 font-medium">{cert.title}</td>
                <td className="p-4 hidden md:table-cell text-muted-foreground">
                  {cert.issuer}
                </td>
                <td className="p-4 hidden sm:table-cell text-muted-foreground">
                  {formatDate(cert.issue_date)}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/certificates/${cert.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cert.id, cert.title)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
