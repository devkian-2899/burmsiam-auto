import { Suspense } from "react";
import { ProgramPage } from "../../components/program-page";

export async function generateMetadata({ params }) {
  const { abbr } = await params;
  const name = String(abbr || "").toUpperCase();
  return { title: `${name} · BurmSiamAuto` };
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<p className="program-empty">Loading episodes…</p>}>
      <NamedProgram params={params} />
    </Suspense>
  );
}

async function NamedProgram({ params }) {
  const { abbr } = await params;
  return <ProgramPage name={abbr} />;
}
