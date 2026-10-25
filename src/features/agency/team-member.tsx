import type { TeamMember } from "./data";
export function TeamMemberCard({ member }: { member: TeamMember }) {
  if (member.publication.status !== "approved" || !member.publication.evidence.trim() || !member.name.trim() || !member.role.trim()) return null;
  return <article className="agency-team-profile"><h3>{member.name}</h3><p>{member.role}</p>{member.description && <p>{member.description}</p>}</article>;
}
