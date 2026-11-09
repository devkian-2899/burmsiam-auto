import { AdminShell } from "../../../../components/admin/shell";
import { PreviewSave } from "../../../../components/admin/preview-save";
import { site } from "../../../../content/site";

export const metadata = {
  title: "Add season · BurmSiamAuto",
};

export default function AddSeasonPage() {
  return (
    <AdminShell>
      <section className="admin-card">
        <h1>Add more Season</h1>
        <p className="admin-lead">Add a season, and a volume inside it, to a program.</p>
        <PreviewSave label="Add season">
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
            <span>Season number</span>
            <input name="season" type="number" min="1" defaultValue="1" />
          </label>
          <label>
            <span>Volume number</span>
            <input name="volume" type="number" min="1" defaultValue="1" />
          </label>
        </PreviewSave>
      </section>
    </AdminShell>
  );
}
