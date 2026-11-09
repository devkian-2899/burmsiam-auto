import { Suspense } from "react";
import { CatalogEditor } from "../../../../../components/admin/catalog-editor";
import { EpisodeForm } from "../../../../../components/admin/episode-form";

export const metadata = { title: "Edit episode · BurmSiamAuto" };

export default function EditEpisodePage() {
  return (
    <Suspense fallback={<p className="admin-status">Loading episode…</p>}>
      <CatalogEditor
        endpoint="/api/admin/episodes"
        recordKey="episode"
        missing="Episode not found"
        Form={EpisodeForm}
      />
    </Suspense>
  );
}