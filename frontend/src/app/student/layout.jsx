import Navigation from "@/components/student/Navigation";

/**
 * This is a Server Component by default.
 * If Navigation is a client component it still works
 * because it’s imported from here.
 */
export const metadata = {
  title: "Student Portal",
};

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* nav stays fixed on the left */}
      <Navigation />

      {/* routed pages render here */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
