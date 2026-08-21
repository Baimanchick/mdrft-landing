import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-page">
      <p>404</p>
      <h1>Траектория потеряна</h1>
      <Link href="/">Вернуться на главную</Link>
    </main>
  );
}
