import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { ContactForm } from "@/features/contact/components/contact-form";
import { Mail, MapPin, Github, Linkedin, Phone } from "lucide-react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const email = settings.email;
  const githubUrl = settings.github_url;
  const linkedinUrl = settings.linkedin_url;
  const phone = settings.phone;

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    ...(phone
      ? [
          {
            icon: Phone,
            label: "Phone",
            value: phone,
            href: `tel:${phone}`,
          },
        ]
      : []),
    {
      icon: Github,
      label: "GitHub",
      value: githubUrl.replace("https://", ""),
      href: githubUrl,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: linkedinUrl.replace("https://", ""),
      href: linkedinUrl,
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Kerala, India",
      href: null,
    },
  ];

  return (
    <>
      <PageHeader
        title="Contact"
        description="Have a question, project idea, or just want to say hi?"
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground/40 mb-2">
              Connect
            </p>
            {contactInfo.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="glass rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
                  <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground/60">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              );

              return item.href ? (
                <Link key={item.label} href={item.href}>
                  {content}
                </Link>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold tracking-tight">Send a message</h3>
                <p className="mt-1 text-sm text-muted-foreground/60">
                  I&apos;ll get back to you within 24 hours.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
