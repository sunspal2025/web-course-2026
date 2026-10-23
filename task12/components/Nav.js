'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="row" aria-label="Навигация">
      {[
        ['/', 'Операции'],
        ['/add', 'Добавить'],
        ['/stats', 'Статистика'],
      ].map(([href, label]) => (
        <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
