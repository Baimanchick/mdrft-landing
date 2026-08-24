const BRAND_SRC = "/images/logo.webp";
const BADGE_SRC = "/images/m-logo.webp";

export type ClusterImages = {
  readonly brand: HTMLImageElement;
  readonly badge: HTMLImageElement;
};

export function loadClusterImages(): ClusterImages {
  const brand = new Image();
  const badge = new Image();

  brand.decoding = "async";
  badge.decoding = "async";
  brand.src = BRAND_SRC;
  badge.src = BADGE_SRC;

  return { brand, badge };
}

export function isImageReady(image: HTMLImageElement): boolean {
  return image.complete && image.naturalWidth > 0;
}
