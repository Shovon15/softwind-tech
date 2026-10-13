import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  PinterestIcon,
  WhatsAppIcon,
  XIcon,
  YoutubeIcon,
} from "@/assets/icons";
import { cn } from "@/utils/helpers/cn";

const ICONS: Record<string, React.ComponentType<any>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  pinterest: PinterestIcon,
  whatsapp: WhatsAppIcon,
  x: XIcon,
  twitter: XIcon,
  youtube: YoutubeIcon,
};

type Props = {
  links: ISocialItem[];
  className?: string;
};

const SocialLinks = ({ links, className }: Props) => {
  return (
    <div className={cn("items-center gap-3", className)}>
      {links.map((link) => {
        const Icon = ICONS[link.name?.trim().toLowerCase()];
        if (!Icon || !link.url) return null;

        return (
          <a
            key={`${link.name}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
