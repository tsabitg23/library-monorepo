import { TopNavBar } from "@/components/top-nav-bar";

export default function BookDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <TopNavBar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">Book details</h1>
      </main>
    </div>
  );
}