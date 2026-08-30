import { TopNavBar } from "@/components/top-nav-bar";

export default function BorrowPage() {
  return (
    <div className="min-h-screen bg-white">
      <TopNavBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Borrow List
          </h1>
          <p className="text-muted-foreground">
            Your borrow list content coming soon
          </p>
        </div>
      </main>
    </div>
  );
}
