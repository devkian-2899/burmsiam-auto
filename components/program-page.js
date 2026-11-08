import { volumesFor } from "../content/catalog";
import { site } from "../content/site";
import { Footer } from "./footer";
import { ProgramScreen } from "./program-screen";

export function ProgramPage({ name }) {
  return (
    <>
      <ProgramScreen
        name={name}
        icon={`/images/programs/${name}.png`}
        logo={site.headerLogo}
        volumes={volumesFor(name)}
      />
      <Footer />
    </>
  );
}
