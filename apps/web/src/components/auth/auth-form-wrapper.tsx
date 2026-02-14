'use client';

import type { ReactNode } from 'react';

interface AuthFormWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthFormWrapper({
  title,
  description,
  children,
  footer,
}: AuthFormWrapperProps) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border-default bg-elevated/80 backdrop-blur-xl p-8 shadow-glass">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-heading-md font-bold tracking-tight">
            <span className="bg-gradient-to-r from-accent-500 via-cyan-400 to-lime-400 bg-clip-text text-transparent">
              Echoglot
            </span>
          </h1>
        </div>

        {/* Title & description */}
        <div className="mb-6 text-center">
          <h2 className="text-heading-sm font-semibold text-text-primary">
            {title}
          </h2>
          <p className="mt-2 text-body-sm text-text-secondary">
            {description}
          </p>
        </div>

        {/* Form content */}
        <div>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 text-center">{footer}</div>
        )}
      </div>
    </div>
  );
}
