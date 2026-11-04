import Image from "next/image";
import type { Profile } from "@/types/resume";
import { ExternalLink } from "@/components/ui/ExternalLink";

export function ResumeHeader({ profile }: { profile: Profile }) {
  return (
    <header className="resume-header" data-profile-id={profile.id}>
      <div className="profile-heading">
        <div>
          <p className="eyebrow">Curriculum vitae</p>
          <h1 id="resume-name">{profile.fullName}</h1>
          <p className="headline">{profile.headline}</p>
        </div>
        {profile.image && (
          <Image
            className="profile-image"
            src={profile.image.src}
            alt={profile.image.alt}
            width={88}
            height={88}
            unoptimized
          />
        )}
      </div>
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
