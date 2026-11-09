import { volumesFor } from "../content/catalog";
import { site } from "../content/site";
import { Footer } from "./footer";
import { ProgramScreen } from "./program-screen";

export function ProgramPage({ name }) {
  const program = site.programs.find((item) => item.name === name) || {};
  return (
    <>
      <ProgramScreen
        name={name}
        icon={`/images/programs/${name}.png`}
        cover={program.cover || ""}
        description={program.description || ""}
        logo={site.headerLogo}
        volumes={volumesFor(name)}
      />
      <Footer />
    </>
  );
}
