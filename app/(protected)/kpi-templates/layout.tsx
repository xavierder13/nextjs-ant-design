import ProtectedLayout from "@/components/ProtectedLayout";

export default function PermissionPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout permission="permission-list">
      {children}
    </ProtectedLayout>
  );
}