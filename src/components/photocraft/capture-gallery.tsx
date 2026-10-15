type CaptureImage = {
  file: string;
  alt: string;
  caption: string;
};

export function CaptureGallery({
  title,
  description,
  openLabel,
  images,
}: {
  title: string;
  description: string;
  openLabel: string;
  images: CaptureImage[];
}) {
  return (
    <div className="pc-capture-gallery">
      <div className="pc-capture-intro">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="pc-capture-grid">
        {images.map((image) => (
          <figure key={image.file}>
            <a
              href={`/imgs/photocraft/captures/${image.file}.png`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${openLabel}: ${image.caption}`}
            >
              <img
                src={`/imgs/photocraft/captures/${image.file}.webp`}
                alt={image.alt}
                width="1440"
                height="900"
                loading="lazy"
              />
            </a>
            <figcaption>
              {image.caption} · {openLabel}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
