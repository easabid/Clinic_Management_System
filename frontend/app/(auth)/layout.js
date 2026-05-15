export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50
      flex items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}