import { TopNavBar } from "@/components/top-nav-bar";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-10">
        <div className="w-full rounded-lg border border-border bg-white p-6 text-center shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold text-foreground">Create an account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Registration will be available soon.</p>
        </div>
      </main>
    </div>
  );
}