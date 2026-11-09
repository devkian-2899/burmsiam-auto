import { Suspense } from "react";
import { CatalogEditor } from "../../../../../../components/admin/catalog-editor";
import { ProgramForm } from "../../../../../../components/admin/program-form";

export const metadata = { title: "Edit program · BurmSiamAuto" };

export default function EditProgramPage() {
  return (
    <Suspense fallback={<p className="admin-status">Loading program…</p>}>
      <CatalogEditor
        endpoint="/api/admin/programs"
        recordKey="program"
        missing="Program not found"
        Form={ProgramForm}
      />
    </Suspense>
  );
}
