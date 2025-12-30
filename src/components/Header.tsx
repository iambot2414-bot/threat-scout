import { Shield, Menu, Github, BookOpen } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground tracking-tight">
              Threat<span className="text-primary">Intel</span>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              IOC Aggregation Platform
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm">Dashboard</Button>
          <Button variant="ghost" size="sm">Search</Button>
          <Button variant="ghost" size="sm">Reports</Button>
          <Button variant="ghost" size="sm">Settings</Button>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <BookOpen className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Github className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 pl-2 border-l border-border/50">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground hidden sm:inline">3 sources online</span>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
