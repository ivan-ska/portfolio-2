import { Link } from 'react-router'
import './pages.css'

export default function NotFound() {
  return (
    <main className="message">
      <p>Такой страницы нет.</p>
      <Link className="text-button" to="/">
        На главную
      </Link>
    </main>
  )
}
