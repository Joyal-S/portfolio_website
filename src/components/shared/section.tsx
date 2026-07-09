import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("section-padding", className)}>
      <Container>{children}</Container>
    </section>
  );
}
