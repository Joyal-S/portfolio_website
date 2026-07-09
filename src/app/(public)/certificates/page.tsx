import type { Metadata } from "next";
import Image from "next/image";
import { getCertificates } from "@/features/certificates/queries";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { GlowCard } from "@/components/shared/glow-card";
import { ExternalLink, Calendar, Award } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "Professional certifications and credentials I've earned.",
};

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return (
    <>
      <PageHeader
        title="Certificates"
        description="Professional certifications and credentials that validate my expertise."
      />
      <Section>
        {certificates.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert, i) => (
              <GlowCard key={cert.id} delay={i * 0.1}>
                {cert.image_url && (
                  <div className="relative w-full h-40 overflow-hidden">
                    <Image
                      src={cert.image_url}
                      alt={cert.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 mb-4">
                    <Award className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>

                  <h3 className="font-semibold mb-1">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {cert.issuer}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {formatDate(cert.issue_date)}
                  </div>

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View credential
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </GlowCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No certificates yet"
            description="Certificates I earn will appear here."
            icon={<Award className="h-8 w-8" />}
          />
        )}
      </Section>
    </>
  );
}
