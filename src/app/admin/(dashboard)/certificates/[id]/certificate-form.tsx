"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCertificate, updateCertificate } from "@/features/admin/actions";
import { toast } from "sonner";
import { FileUpload } from "@/components/shared/file-upload";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issue_date: z.string().min(1, "Date is required"),
  credential_id: z.string().optional(),
  credential_url: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
}

export function CertificateForm({
  certificate,
  isNew,
}: {
  certificate: Certificate | null;
  isNew: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(certificate?.image_url ?? "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: certificate?.title ?? "",
      issuer: certificate?.issuer ?? "",
      issue_date: certificate?.issue_date
        ? certificate.issue_date.substring(0, 10)
        : "",
      credential_id: certificate?.credential_id ?? "",
      credential_url: certificate?.credential_url ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        issuer: data.issuer,
        issue_date: data.issue_date,
        credential_id: data.credential_id || null,
        credential_url: data.credential_url || null,
        image_url: imageUrl || null,
      };

      if (isNew) {
        await createCertificate(payload);
        toast.success("Certificate created");
      } else if (certificate) {
        await updateCertificate(certificate.id, payload);
        toast.success("Certificate updated");
      }

      router.push("/admin/certificates");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass rounded-xl p-6 space-y-6 max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            {...register("title")}
            placeholder="AWS Certified Solutions Architect"
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Issuer</label>
          <Input
            {...register("issuer")}
            placeholder="Amazon Web Services"
          />
          {errors.issuer && (
            <p className="text-xs text-destructive">
              {errors.issuer.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Issue Date</label>
          <Input type="date" {...register("issue_date")} />
          {errors.issue_date && (
            <p className="text-xs text-destructive">
              {errors.issue_date.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Image / PDF</label>
          <FileUpload
            bucket="certificates"
            value={imageUrl}
            onChange={(v) => setImageUrl(v as string)}
            accept="image/*,.pdf"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Credential ID</label>
          <Input
            {...register("credential_id")}
            placeholder="Optional"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Credential URL</label>
          <Input
            {...register("credential_url")}
            placeholder="https://credential.example.com/..."
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isNew ? "Create Certificate" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/certificates")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
