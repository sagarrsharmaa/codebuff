'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface DashboardNavProps {
  links: {
    href: string;
    icon: React.ReactNode;
    label: string;
  }[];
  signOutForm: React.ReactNode;
}

export function DashboardNav({ links, signOutForm }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="relative z-20 border-b border-border-subtle bg-background-base/80 backdrop-blur-lg">
      <div className="max-w-5xl mx-auto px-gutter md:px-gutter-lg flex items-center justify-between h-14">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="font-display text-lg font-bold text-text-primary tracking-display"
        >
          Codebuff
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent-purple/10 text-accent-purple'
                    : 'text-text-muted hover:text-text-primary hover:bg-background-card'
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}

          <div className="w-px h-5 bg-border-subtle mx-2" />

          {signOutForm}
        </div>
      </div>
    </nav>
  );
}
