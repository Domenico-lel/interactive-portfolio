const socials: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/Domenico-lel' },
  { label: 'LinkedIn', href: '#' },
]

const pages = [
  { label: 'Home', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <a className="footer__mark wordmark" href="#contact" aria-label="Get in touch">
        <span>Let&apos;s</span>
        <span>Talk.</span>
      </a>

      <div className="footer__cols">
        <div className="footer__col">
          <span className="footer__heading">Elsewhere</span>
          {socials.map((s) => (
            <a
              key={s.label}
              className="footer__link"
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              {s.label}
            </a>
          ))}
        </div>
        <div className="footer__col">
          <span className="footer__heading">Sitemap</span>
          {pages.map((p) => (
            <a key={p.label} className="footer__link" href={p.href}>
              {p.label}
            </a>
          ))}
        </div>
      </div>

      <div className="footer__meta">
        <span className="footer__copy">© {year} Domenico Lella</span>
        <a className="footer__top" href="#top" aria-label="Back to top">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
