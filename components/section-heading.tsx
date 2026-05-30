type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-5">
      <span className="chip border-sky-200 bg-white text-sky-700">
        {eyebrow}
      </span>
      <div className="space-y-4">
        <h2 className="font-display text-[2rem] leading-[0.95] tracking-tight text-slate-950 sm:text-[2.5rem] lg:text-[3rem]">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
          {description}
        </p>
      </div>
    </div>
  );
}
