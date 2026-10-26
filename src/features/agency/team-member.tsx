import type { CSSProperties } from "react";
import type { TeamMember } from "./data";
import { resolveMedia } from "@/features/media/files";
import { MediaContent } from "@/features/media/approved-media";
import { Plane } from "@/components/icons";
export type ProfileClasses = { profile?: string; monogram?: string; portrait?: string; featured?: string; body?: string };

const initials = (name: string) => name.split(" ").map(part => part.replace(/^[^A-Za-zÁÉÍÓÚÑáéíóúñ]+/, "")[0]).join("").slice(0, 2);

// Profile approval and portrait approval are separate; a branded monogram frame
// holds the place until an authorized portrait exists.
export function TeamMemberCard({ member, featured = false, classes = {}, index = 0 }: { member: TeamMember; featured?: boolean; classes?: ProfileClasses; index?: number }) {
  if (member.publication.status !== "approved" || !member.publication.evidence.trim() || !member.name.trim() || !member.role.trim()) return null;
  const portrait = resolveMedia(`team:${member.id}`);
  return <article className={`agency-team-profile ${classes.profile ?? ""} ${featured ? classes.featured ?? "" : ""}`} style={{ "--i": index } as CSSProperties}>
    {portrait ? <span className={classes.portrait} data-team-portrait>
      <MediaContent asset={portrait} sizes="(max-width: 639px) 46vw, (max-width: 1100px) 31vw, 22vw" />
    </span> : <span className={classes.monogram} aria-hidden="true"><Plane /><b>{initials(member.name)}</b></span>}
    <div className={classes.body}><h3>{member.name}</h3><p>{member.role}</p>{member.description && <p>{member.description}</p>}</div>
  </article>;
}
