import { Suspense } from "react";
import { CatalogEditor } from "../../../../../../components/admin/catalog-editor";
import { SeasonForm } from "../../../../../../components/admin/season-form";

export const metadata = { title: "Edit season · BurmSiamAuto" };

export default function EditSeasonPage() {
  return (
    <Suspense fallback={<p className="admin-status">Loading season…</p>}>
      <CatalogEditor
        endpoint="/api/admin/seasons"
        recordKey="season"
        missing="Season not found"
        Form={SeasonForm}
      />
    </Suspense>
  );
}
