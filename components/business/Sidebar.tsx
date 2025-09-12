"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderIcon, LayoutIcon, DocIcon, ImageIcon, VideoIcon, AudioIcon, TrashIcon } from '@/components/shared/icons';

const base = 'flex items-center gap-2 rounded-md px-3 py-2 text-sm';
const passive = 'text-gray-700 hover:bg-gray-200/60';
const active = 'bg-black text-white';

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  return (
    <Link href={href} className={`${base} ${isActive ? active : passive}`}>
      {icon}
      {label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 flex flex-col gap-6 border-r min-h-screen">
      <div className="flex items-center gap-2">
        <FolderIcon size={18} />
        <div className="text-lg font-semibold">File Manager</div>
      </div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Menu</div>
        <nav className="flex flex-col gap-1">
          <NavItem href="/dashboard" icon={<LayoutIcon />} label="Dashboard" />
          <NavItem href="/folders" icon={<FolderIcon />} label="Folders" />
          <NavItem href="/documents" icon={<DocIcon />} label="Documents" />
          <NavItem href="/images" icon={<ImageIcon />} label="Images" />
          <NavItem href="/videos" icon={<VideoIcon />} label="Videos" />
          <NavItem href="/audios" icon={<AudioIcon />} label="Audios" />
          <NavItem href="/deleted" icon={<TrashIcon />} label="Deleted files" />
        </nav>
      </div>
    </aside>
  );
} 