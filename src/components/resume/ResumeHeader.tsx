import { ProfileSection } from "./ProfileSection";
import type { Profile } from "@/types/resume";
import { ExternalLink } from "@/components/ui/ExternalLink";

export function ResumeHeader({ profile }: { profile: Profile }) {
  return (
    <header className="resume-header" data-profile-id={profile.id}>
      <ProfileSection profile={profile} />
      <address className="contact">
        {profile.location && <span>{profile.location}</span>}
        {profile.email && (
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        )}
        {profile.phone && (
          <a href={`tel:${profile.phone.replace(/[^+0-9]/g, "")}`}>
            {profile.phone}
          </a>
        )}
        {profile.socialLinks?.map((link) => (
          <ExternalLink key={link.id} href={link.url}>
            {link.label}
          </ExternalLink>
        ))}
      </address>
    </header>
  );
}
