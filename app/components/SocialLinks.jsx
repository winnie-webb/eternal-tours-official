import { FaFacebookF, FaInstagram, FaTiktok, FaTripadvisor } from "react-icons/fa";

export const CONTACT = {
  email: "eternaltours876@gmail.com",
  phone: "+1 (876) 855-9645",
  phoneHref: "tel:+18768559645",
  tripadvisor:
    "https://www.tripadvisor.com/Attraction_Review-g147311-d23245962-Reviews-Jamaica_Eternal_Tours_And_Transportation-Montego_Bay_Saint_James_Parish_Jamaica.html",
};

const LINKS = [
  { href: "https://www.tiktok.com/@eternaltours.ja", label: "TikTok", Icon: FaTiktok },
  { href: "https://www.facebook.com/desmond.brown.756859", label: "Facebook", Icon: FaFacebookF },
  { href: "https://www.instagram.com/jamaica_eternal_tours/", label: "Instagram", Icon: FaInstagram },
  { href: CONTACT.tripadvisor, label: "Tripadvisor", Icon: FaTripadvisor },
];

export function SocialLinks({ className = "", tone = "light" }) {
  const style =
    tone === "dark"
      ? "border-white/15 text-sand-100 hover:bg-sun-400 hover:text-ink hover:border-sun-400"
      : "border-ink/10 text-ink hover:bg-ink hover:text-sand-50";
  return (
    <div className={`flex gap-2 ${className}`}>
      {LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`grid h-10 w-10 place-items-center rounded-full border transition ${style}`}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
