import type { TeamMember } from "./data";
import { resolveMedia } from "@/features/media/files";
import { MediaContent } from "@/features/media/approved-media";
export type ProfileClasses = { profile?: string; monogram?: string; portrait?: string; featured?: string };

const initials = (name: string) => name.split(" ").map(part => part.replace(/^[^A-Za-zÁÉÍÓÚÑáéíóúñ]+/, "")[0]).join("").slice(0, 2);

// Profile approval and portrait approval are separate; initials remain the fallback.
export function TeamMemberCard({ member, featured = false, classes = {} }: { member: TeamMember; featured?: boolean; classes?: ProfileClasses }) {
  if (member.publication.status !== "approved" || !member.publication.evidence.trim() || !member.name.trim() || !member.role.trim()) return null;
  const portrait = resolveMedia(`team:${member.id}`);
  return <article className={`agency-team-profile ${classes.profile ?? ""} ${featured ? classes.featured ?? "" : ""}`}>
    {portrait ? <span className={classes.portrait} data-team-portrait>
      <MediaContent asset={portrait} sizes={featured ? "(max-width: 480px) 70vw, (max-width: 1100px) 200px, 28vw" : "56px"} />
    </span> : <span className={classes.monogram} aria-hidden="true">{initials(member.name)}</span>}
    <div><h3>{member.name}</h3><p>{member.role}</p>{member.description && <p>{member.description}</p>}</div>
  </article>;
}
