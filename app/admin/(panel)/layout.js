import { Suspense } from "react";
import { PanelFrame } from "../../../components/admin/panel-frame";

export default function PanelLayout({ children }) {
  return (
    <Suspense fallback={<p className="admin-status">Checking sign-in…</p>}>
      <PanelFrame>{children}</PanelFrame>
    </Suspense>
  );
}
