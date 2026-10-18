/* eslint-disable @next/next/no-img-element */
export function Crest({ src, alt, size = 24 }: { src: string | null; alt: string; size?: number }) {
  if (!src) {
    return (
      <span
        aria-hidden
        className="inline-block rounded-full bg-tier-3"
        style={{ width: size, height: size }}
      />
    );
  }
  return <img src={src} alt={alt} width={size} height={size} className="inline-block object-contain" />;
}
