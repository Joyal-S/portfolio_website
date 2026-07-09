import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("py-20 text-center", className)}>
      {icon && <div className="mb-4 flex justify-center text-muted-foreground">{icon}</div>}
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
