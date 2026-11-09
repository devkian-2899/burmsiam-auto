import { AdminShell } from "../../../../components/admin/shell";
import { PreviewSave } from "../../../../components/admin/preview-save";

export const metadata = {
  title: "Add program · BurmSiamAuto",
};

export default function AddProgramPage() {
  return (
    <AdminShell>
      <section className="admin-card">
        <h1>Add more Program</h1>
        <p className="admin-lead">A new program mark for the public program row.</p>
        <PreviewSave label="Add program">
          <label>
            <span>Abbreviation</span>
            <input name="code" placeholder="BSS" />
          </label>
          <label>
            <span>Program name</span>
            <input name="name" />
          </label>
        </PreviewSave>
      </section>
    </AdminShell>
  );
}
