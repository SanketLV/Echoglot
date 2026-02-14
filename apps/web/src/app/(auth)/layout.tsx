export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary bg-gradient-hero p-4">
      {children}
    </div>
  );
}
