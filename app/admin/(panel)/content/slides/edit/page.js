import { Suspense } from "react";
import { CatalogEditor } from "../../../../../../components/admin/catalog-editor";
import { SlideForm } from "../../../../../../components/admin/slide-form";

export const metadata = { title: "Edit slide · BurmSiamAuto" };

export default function EditSlidePage() {
  return (
    <Suspense fallback={<p className="admin-status">Loading slide…</p>}>
      <CatalogEditor
        endpoint="/api/admin/slides"
        recordKey="slide"
        missing="Slide not found"
        Form={SlideForm}
      />
    </Suspense>
  );
}
