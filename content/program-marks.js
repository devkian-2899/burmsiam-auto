// Home page OUR PROGRAM grid — fixed order, images from public/images/programs.

const ORDER = [
  "BSS",
  "BSPS",
  "BSGP",
  "BSAB",
  "VEU",
  "JDM",
  "SOA",
  "TWT",
  "HSD",
  "APA",
  "BSW",
  "BSN",
];

export const localProgramMarks = [
  {
    name: "All Episodes",
    href: "/all-episodes",
    image: {
      src: "/images/main/logos.png",
      srcSet: "",
    },
  },
  ...ORDER.map((abbr) => ({
    name: abbr,
    href: `/${abbr}`,
    image: {
      src: `/images/programs/${abbr}.png`,
      srcSet: "",
    },
  })),
];
