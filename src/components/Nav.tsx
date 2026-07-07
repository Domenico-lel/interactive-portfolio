export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav__group nav__group--left">
        <a className="pill pill--ghost" href="#work">
          Work
        </a>
        <a className="pill pill--ghost" href="#about">
          About
        </a>
      </div>
      <a className="nav__name" href="#top">
        Domenico Lella
      </a>
      <div className="nav__group nav__group--right">
        <a className="pill pill--dark" href="#contact">
          Get in Touch
        </a>
      </div>
    </nav>
  )
}
