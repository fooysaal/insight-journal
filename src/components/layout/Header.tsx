'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookHeart, BarChart3, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <BookHeart className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold font-headline tracking-tight">
              Insight Journal
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Button key={link.href} variant={isActive ? 'secondary' : 'ghost'} size="sm" asChild>
                  <Link href={link.href} className="flex items-center gap-2">
                    <link.icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                    <span className={cn(isActive ? 'font-semibold' : 'font-normal', 'hidden sm:inline')}>{link.label}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
