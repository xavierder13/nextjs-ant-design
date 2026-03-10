import ProtectedLayout from "@/components/ProtectedLayout";

export default function EmployeeMasterDataPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout permission="employee-master-data-list">
      {children}
    </ProtectedLayout>
  );
}