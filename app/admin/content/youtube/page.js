import { AdminShell } from "../../../../components/admin/shell";
import { PreviewSave } from "../../../../components/admin/preview-save";
import { site } from "../../../../content/site";

export const metadata = {
  title: "Recent YouTube link · BurmSiamAuto",
};

export default function YoutubePage() {
  return (
    <AdminShell>
      <section className="admin-card">
        <h1>Change recent YouTube link</h1>
        <p className="admin-lead">This is the film embedded beside the slogan.</p>
        <PreviewSave>
          <label>
            <span>YouTube link</span>
            <input name="youtube" type="url" defaultValue={site.youtube} />
          </label>
        </PreviewSave>
      </section>
    </AdminShell>
  );
}
