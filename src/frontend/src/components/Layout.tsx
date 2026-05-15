import { Toaster } from "sonner";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
        <footer className="flex-shrink-0 bg-card border-t border-border px-6 py-2.5">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{ duration: 4500 }}
      />
    </div>
  );
}
