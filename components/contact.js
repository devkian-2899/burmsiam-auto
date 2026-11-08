import { IconFacebook, IconInstagram, IconLink, IconMail, IconTikTok, IconYouTube } from "./icons";

export function Contact({ contact }) {
  const items = [
    {
      href: `mailto:${contact.email}`,
      label: contact.email,
      text: contact.email,
      icon: <IconMail />,
      external: false,
    },
    {
      href: contact.facebook,
      label: `Facebook ${contact.facebookHandle}`,
      text: contact.facebookHandle,
      icon: <IconFacebook />,
      external: true,
    },
    {
      href: contact.instagram,
      label: `Instagram ${contact.instagramHandle}`,
      text: contact.instagramHandle,
      icon: <IconInstagram />,
      external: true,
    },
    {
      href: contact.youtube,
      label: `YouTube ${contact.youtubeHandle}`,
      text: contact.youtubeHandle,
      icon: <IconYouTube />,
      external: true,
    },
    {
      href: contact.tiktok,
      label: `TikTok ${contact.tiktokHandle}`,
      text: contact.tiktokHandle,
      icon: <IconTikTok />,
      external: true,
    },
    {
      href: contact.more,
      label: contact.moreLabel,
      text: contact.moreLabel,
      icon: <IconLink />,
      external: false,
    },
  ];

  return (
    <section id="contact" className="contact">
      <div className="contact-inner">
        <h2>Contact Us</h2>
        <ul>
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                aria-label={item.label}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.icon}
                <span>{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
