'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@echoglot/ui/lib/utils';

const settingsNav = [
  { label: 'Profile', href: '/settings/profile' },
  { label: 'Preferences', href: '/settings/preferences' },
  { label: 'Account', href: '/settings/account' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-app-title text-text-primary">Settings</h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Manage your account and preferences
        </p>
      </div>

      <nav className="flex gap-1 border-b border-border-default pb-px">
        {settingsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-4 py-2.5 text-body-sm font-medium transition-colors rounded-t-lg',
              pathname === item.href
                ? 'text-accent-500 border-b-2 border-accent-500 -mb-px'
                : 'text-text-tertiary hover:text-text-secondary',
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div>{children}</div>
    </div>
  );
}
