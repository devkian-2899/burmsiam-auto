function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      {children}
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconMail() {
  return (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="1.5" {...stroke} />
      <path d="M4 7l8 6 8-6" {...stroke} />
    </Icon>
  );
}

export function IconFacebook() {
  return (
    <Icon>
      <path
        d="M14 9h2V6h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.2l.8-3H13v-1.2c0-.5.3-.8 1-.8z"
        fill="currentColor"
        stroke="none"
      />
    </Icon>
  );
}

export function IconInstagram() {
  return (
    <Icon>
      <rect x="4" y="4" width="16" height="16" rx="4" {...stroke} />
      <circle cx="12" cy="12" r="3.5" {...stroke} />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconYouTube() {
  return (
    <Icon>
      <rect x="3" y="6.5" width="18" height="11" rx="2.5" {...stroke} />
      <path d="M11 10.2v3.6l3.4-1.8-3.4-1.8z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconTikTok() {
  return (
    <Icon>
      <path
        d="M14 6c.6 2.2 2 3.6 4 4v2.2c-1.4 0-2.7-.4-4-1.2v5.4a4.6 4.6 0 1 1-4-4.6v2.3a2.3 2.3 0 1 0 1.7 2.2V6h2.3z"
        fill="currentColor"
        stroke="none"
      />
    </Icon>
  );
}

export function IconSite() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="8" {...stroke} />
      <path d="M4 12h16M12 4c2.2 2.4 3.2 5 3.2 8s-1 5.6-3.2 8c-2.2-2.4-3.2-5-3.2-8s1-5.6 3.2-8z" {...stroke} />
    </Icon>
  );
}

export function IconLink() {
  return (
    <Icon>
      <path d="M10 13a4 4 0 0 0 6 0l2-2a4 4 0 0 0-5.7-5.7l-1.1 1.1" {...stroke} />
      <path d="M14 11a4 4 0 0 0-6 0l-2 2a4 4 0 0 0 5.7 5.7l1.1-1.1" {...stroke} />
    </Icon>
  );
}

/** 9:16 reel-style frame */
export function IconPostReel() {
  return (
    <Icon>
      <rect x="8" y="3" width="8" height="18" rx="1.5" {...stroke} />
      <path d="M11 14l2.2-1.2v4.4L11 16z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** 16:9 video frame */
export function IconPostVideo() {
  return (
    <Icon>
      <rect x="3" y="7" width="18" height="10" rx="1.5" {...stroke} />
      <path d="M11 10.5v3.5l3.8-1.8-3.8-1.7z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** Carousel / multi-photo stack */
export function IconPostCarousel() {
  return (
    <Icon>
      <rect x="5" y="6" width="11" height="8" rx="1.2" {...stroke} />
      <rect x="8" y="9" width="11" height="8" rx="1.2" {...stroke} />
      <rect x="11" y="12" width="11" height="8" rx="1.2" {...stroke} />
    </Icon>
  );
}
