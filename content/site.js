// Edit this file on GitHub, then push to main. Vercel publishes that push.
//
// Photos: paste the Google Drive link for each picture.
// In Drive, share the file as "Anyone with the link" before you paste it.
// Upload WebP or AVIF at the size noted on each line. To replace a picture
// without editing the site again, upload over the same Drive file.

export const site = {
  name: "BurmSiamAuto",
  slogan: "Uniting Automobile Lovers Everywhere",
  // Header mark. Transparent PNG in public/images/main.
  logo: "/images/main/logos.png",

  // A watch link, a youtu.be link, or the 11-character video id.
  youtube: "https://youtu.be/tBvnHX-5Z6o?si=L6VZdV-k4Q114Sap",

  // 16:9 covers behind the slogan and the film. They crossfade on their own.
  covers: [
    "/images/covers/cover-1.jpg",
    "/images/covers/cover-2.jpg",
    "/images/covers/cover-3.jpg",
    "/images/covers/cover-4.jpg",
  ],

  // Up to 4 photos, 3840 × 2160. href opens in a new tab once the photo has settled.
  slides: [
    {
      image: "https://drive.google.com/file/d/1jG5Ff1Bb5-j2EaB_vtfKz0hD_Qfb3EXL/view?usp=drive_link",
      href: "",
      title: "Latest story 1",
    },
    {
      image: "https://drive.google.com/file/d/1KP6yVWNCp4VigJCMePSfSkc8qlVMJapy/view?usp=drive_link",
      href: "",
      title: "Latest story 2",
    },
    {
      image: "https://drive.google.com/file/d/10dfn1C6UovobKpIa9_PGBW1fy9B17CYS/view?usp=drive_link",
      href: "",
      title: "Latest story 3",
    },
    {
      image: "https://drive.google.com/file/d/1HGIHHsdw98P3XCvJphLXtEXHaFlgsXK_/view?usp=drive_link",
      href: "",
      title: "Latest story 4",
    },
  ],

  // 12 PNG icons, 1080 × 1080, with no background. Each icon opens its own page.
  programs: [
    { image: "/images/programs/BSS.png", name: "BSS", href: "/BSS" },
    { image: "/images/programs/BSPS.png", name: "BSPS", href: "/BSPS" },
    { image: "/images/programs/BSGP.png", name: "BSGP", href: "/BSGP" },
    { image: "/images/programs/ABA.png", name: "ABA", href: "/ABA" },
    { image: "/images/programs/VEU.png", name: "VEU", href: "/VEU" },
    { image: "/images/programs/JDM.png", name: "JDM", href: "/JDM" },
    { image: "/images/programs/SOA.png", name: "SOA", href: "/SOA" },
    { image: "/images/programs/TWT.png", name: "TWT", href: "/TWT" },
    { image: "/images/programs/HSD.png", name: "HSD", href: "/HSD" },
    { image: "/images/programs/APA.png", name: "APA", href: "/APA" },
    { image: "/images/programs/BSW.png", name: "BSW", href: "/BSW" },
    { image: "/images/programs/BSN.png", name: "BSN", href: "/BSN" },
  ],

  contact: {
    email: "contact@burmsiamauto.com",
    facebook: "https://www.facebook.com/burmsiamautomobile",
    facebookHandle: "@burmsiamautomobile",
    instagram: "https://www.instagram.com/burmsiamauto/",
    instagramHandle: "@burmsiamauto",
    youtube: "https://www.youtube.com/@burmsiamauto",
    youtubeHandle: "@burmsiamauto",
    tiktok: "https://www.tiktok.com/@burmsiamauto",
    tiktokHandle: "@burmsiamauto",
    more: "/exploreus",
    moreLabel: "Explore More With Us",
  },
};

// The /exploreus link collection. Social addresses that already live above
// stay in contact. Origin and Kids use the same @burmsiam handle style.
export const exploreLinks = [
  {
    name: "BurmSiamOrigin",
    hint: "YouTube",
    href: "https://www.youtube.com/@burmsiamorigin",
    kind: "youtube",
  },
  {
    name: "BurmSiamAuto",
    hint: "YouTube",
    href: "https://www.youtube.com/@burmsiamauto",
    kind: "youtube",
  },
  {
    name: "Instagram",
    hint: "@burmsiamauto",
    href: "https://www.instagram.com/burmsiamauto/",
    kind: "instagram",
  },
  {
    name: "Facebook",
    hint: "@burmsiamautomobile",
    href: "https://www.facebook.com/burmsiamautomobile",
    kind: "facebook",
  },
  {
    name: "TikTok",
    hint: "@burmsiamauto",
    href: "https://www.tiktok.com/@burmsiamauto",
    kind: "tiktok",
  },
  {
    name: "BurmSiam Kids",
    hint: "YouTube",
    href: "https://www.youtube.com/@burmsiamkids",
    kind: "youtube",
  },
  {
    name: "BurmSiam Website",
    hint: "burmsiamauto.com",
    href: "/",
    kind: "site",
  },
];
