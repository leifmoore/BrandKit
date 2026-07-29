import { Button } from "../../components/ui/button";
import { PageHeader } from "../../components/layout/page-header";

export function PageHeaderExample() {
  return (
    <PageHeader
      title="Bookings"
      subtitle="Manage upcoming customer bookings."
      actions={<Button>Create booking</Button>}
    />
  );
}
