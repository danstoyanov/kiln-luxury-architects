export type ImageSlot = "hero" | "courtyard" | "ridge" | "woodland";

type ConceptImageProps = {
  slot: ImageSlot;
  alt: string;
  sizes: string;
  frameClassName?: string;
  imageClassName?: string;
  priority?: boolean;
};

const widths = [480, 768, 1280, 1536];

function imageSourceSet(slot: ImageSlot, extension: "webp" | "jpg") {
  return widths
    .map((width) => `/assets/${slot}-${width}.${extension} ${width}w`)
    .join(", ");
}

export function ConceptImage({
  slot,
  alt,
  sizes,
  frameClassName,
  imageClassName,
  priority = false,
}: ConceptImageProps) {
  return (
    <picture className={frameClassName}>
      <source
        type="image/webp"
        srcSet={imageSourceSet(slot, "webp")}
        sizes={sizes}
      />
      <img
        className={imageClassName}
        src={`/assets/${slot}-1536.jpg`}
        srcSet={imageSourceSet(slot, "jpg")}
        sizes={sizes}
        width={1536}
        height={1024}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}
