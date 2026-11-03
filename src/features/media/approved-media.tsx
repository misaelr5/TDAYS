import { getImageProps } from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { MediaSlot, PublicImage, PublicMedia } from "@/config/media";
import { resolveMedia } from "./files";
import { AmbientVideo } from "./ambient-video";

function ResponsiveImage({ asset, sizes = "(max-width: 767px) 70vw, 30vw", eager = false }: { asset: PublicImage; sizes?: string; eager?: boolean }) {
  const common = { alt: asset.alt, fill: true, sizes, loading: eager ? "eager" as const : "lazy" as const, fetchPriority: eager ? "high" as const : "auto" as const };
  const { props } = getImageProps({ ...common, src: asset.desktop.src });
  const mobile = asset.mobile && getImageProps({ ...common, src: asset.mobile.src }).props;
  const point = asset.desktop.focal;
  const small = asset.mobile?.focal ?? point;
  const style = { "--media-focal": `${point.x}% ${point.y}%`, "--media-focal-mobile": `${small.x}% ${small.y}%` } as CSSProperties;
  // React does not automatically preload images inside <picture>. Keep the
  // hints responsive too, so only the source selected by the viewport is fetched.
  return <>
    {eager && <>
      {mobile && <link rel="preload" as="image" media="(max-width: 767px)" imageSrcSet={mobile.srcSet} imageSizes={sizes} fetchPriority="high" />}
      <link rel="preload" as="image" media={mobile ? "(min-width: 768px)" : undefined} imageSrcSet={props.srcSet} imageSizes={sizes} fetchPriority="high" />
    </>}
    <picture className="approved-media-picture" style={style}>
    {mobile && <source media="(max-width: 767px)" srcSet={mobile.srcSet} sizes={common.sizes} />}
    <img {...props} alt={asset.alt} />
    </picture>
  </>;
}
export function MediaContent({ asset, allowVideo = false, sizes, eager = false }: { asset: PublicMedia; allowVideo?: boolean; sizes?: string; eager?: boolean }) {
  if (asset.type === "image") return <ResponsiveImage asset={asset} sizes={sizes} eager={eager} />;
  const poster: PublicImage = { type: "image", alt: "", desktop: asset.desktop.poster, mobile: asset.mobile?.poster };
  const image = <ResponsiveImage asset={poster} sizes={sizes} eager={eager} />;
  // Linked postcards use only the poster: no nested pause button inside an anchor.
  return allowVideo && asset.decorative ? <AmbientVideo asset={asset}>{image}</AmbientVideo> : image;
}
export function ApprovedMedia({ slot, sizes, eager = false, children }: { slot: MediaSlot; sizes?: string; eager?: boolean; children: ReactNode }) {
  const asset = resolveMedia(slot);
  return asset ? <div className="postcard-photo"><MediaContent asset={asset} sizes={sizes} eager={eager} /></div> : children;
}
