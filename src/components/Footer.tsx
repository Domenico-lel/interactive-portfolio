const socials = ['X', 'LinkedIn', 'Instagram', 'Dribbble']
const pages = ['Home', 'Work', 'About']

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__col">
        {socials.map((s) => (
          <a key={s} className="footer__link" href="#">
            {s}
          </a>
        ))}
      </div>
      <div className="footer__col">
        {pages.map((p) => (
          <a key={p} className="footer__link" href="#">
            {p}
          </a>
        ))}
      </div>
      <span className="footer__copy">©Domenico Lella 2026</span>
    </footer>
  )
}
