import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, description, align = 'left', light = false, className = '' }) {
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start';
  return (
    <Reveal className={`flex max-w-3xl flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow && <p className={`eyebrow ${light ? '!text-gold' : ''}`}>{eyebrow}</p>}
      <h2 className={`text-balance text-4xl leading-[1.1] sm:text-5xl ${light ? 'text-ivory' : 'text-forest'}`}>
        {title}
      </h2>
      {description && (
        <p className={`max-w-xl text-base leading-relaxed ${light ? 'text-ivory/70' : 'text-muted'}`}>{description}</p>
      )}
    </Reveal>
  );
}
