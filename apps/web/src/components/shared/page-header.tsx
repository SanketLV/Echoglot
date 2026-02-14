interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-heading-lg font-bold text-text-primary">{title}</h1>
      {description && (
        <p className="text-body-md text-text-secondary">{description}</p>
      )}
    </div>
  );
}
