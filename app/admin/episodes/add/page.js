import { AdminShell } from "../../../../components/admin/shell";
import { PreviewSave } from "../../../../components/admin/preview-save";
import { site } from "../../../../content/site";

export const metadata = {
  title: "Add episode · BurmSiamAuto",
};

export default function AddEpisodePage() {
  return (
    <AdminShell>
      <section className="admin-card">
        <h1>Add more episodes</h1>
        <p className="admin-lead">Add one episode card to a season and volume.</p>
        <PreviewSave label="Add episode">
          <label>
            <span>Program</span>
            <select name="program" defaultValue="">
              <option value="">Select a program</option>
              {site.programs.map((program) => (
                <option key={program.name} value={program.name}>{program.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Season</span>
            <input name="season" type="number" min="1" defaultValue="1" />
          </label>
          <label>
            <span>Volume</span>
            <input name="volume" type="number" min="1" defaultValue="1" />
          </label>
          <label>
            <span>Episode number</span>
            <input name="episode" type="number" min="1" defaultValue="1" />
          </label>
          <label>
            <span>Title</span>
            <input name="title" />
          </label>
          <label>
            <span>Episode photo</span>
            <input name="image" placeholder="Photo address" />
          </label>
        </PreviewSave>
      </section>
    </AdminShell>
  );
}
