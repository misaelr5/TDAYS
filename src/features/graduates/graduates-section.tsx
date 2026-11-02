import { whatsappUrl } from "@/config/site";
import { resolveMedia } from "@/features/media/files";
import { MediaContent } from "@/features/media/approved-media";
import { graduates } from "./data";
import { GraduatesPrograms } from "./graduates-programs";
import { GraduatesScene } from "./graduates-scene";
import styles from "./graduates.module.css";

export function GraduatesSection({ expanded = false }: { expanded?: boolean }) {
  const levels = graduates.levels.map(({ message, mediaSlot, ...level }) => {
    // Resolve each audience separately; render only approved public derivatives.
    const media = resolveMedia(mediaSlot);
    return {
      ...level,
      href: whatsappUrl(message),
      caption: media ? (level.id === "maestros" ? level.caption : "Viajes escolares · archivo de Travel Days")
        : (level.id === "maestros" ? "Ilustración · una salida por conversar" : level.caption),
      photographic: media !== null,
      visual: media ? <MediaContent asset={media} allowVideo={level.id !== "maestros"} sizes="(max-width: 767px) 90vw, (max-width: 1300px) 50vw, 680px" />
        : <GraduatesScene variant={level.id === "primaria" ? "morning" : "sunset"} framing="landscape" />,
    };
  });

  return (
    <section id="egresados" className={`${styles.section} section-pad`} aria-labelledby="graduates-title" data-graduates={expanded ? "expanded" : "preview"}>
      <GraduatesPrograms levels={levels} expanded={expanded} />


    </section>
  );
}
