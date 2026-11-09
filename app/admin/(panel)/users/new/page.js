import { UserForm } from "../../../../../components/admin/user-form";

export const metadata = {
  title: "New account · BurmSiamAuto",
};

export default function NewAccountPage() {
  return (
      <UserForm mode="create" />
  );
}
