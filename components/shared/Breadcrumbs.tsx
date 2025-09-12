import Link from 'next/link';
import { cn } from '@/lib/utils';

export type Crumb = { id: string; name: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav className={cn('text-sm text-gray-600', className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, idx) => (
          <li key={item.id} className="flex items-center gap-2">
            {idx > 0 && <span className="text-gray-400">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:underline">
                {item.name}
              </Link>
            ) : (
              <span className="font-medium text-gray-900">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
