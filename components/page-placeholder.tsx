type PlaceholderProps = {
  title: string;
  description: string;
  cta?: string;
};

export function PagePlaceholder({
  title,
  description,
  cta = "Coming soon",
}: PlaceholderProps) {
  return (
    <div className="rounded-lg border bg-card p-10 text-center text-muted-foreground">
      <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
      <p className="mt-4 text-base">{description}</p>
      <button className="mt-6 rounded-md border px-5 py-2 text-sm font-medium text-foreground">
        {cta}
      </button>
    </div>
  );
}

