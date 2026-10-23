import './globals.css';
import Nav from '../components/Nav';
import { FinanceProvider } from '../components/FinanceProvider';
export const metadata = {
  title: 'Zen-Money / Финансовая ясность',
  description: 'Учебный финансовый трекер на Next.js',
  icons: { icon: 'data:,' },
};
export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <header className="topbar">
          <strong>Zen / Money</strong>
          <Nav />
        </header>
        <FinanceProvider>{children}</FinanceProvider>
        <footer className="page-footer">Пальцев Вячеслав · Группа 11 · Next.js</footer>
      </body>
    </html>
  );
}
