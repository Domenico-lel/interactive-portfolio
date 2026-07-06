function Project({
  label,
  title,
  href,
}: {
  label: string
  title: string
  href: string
}) {
  return (
    <article className="project project--wide">
      <span className="project__label">{label}</span>
      <a className="project__link" href={href} target="_blank" rel="noreferrer">
        <div className="card card--showcase">
          <div className="phone">
            <span className="phone__island" />
            <video
              className="phone__screen"
              autoPlay
              muted
              loop
              playsInline
              poster="/assets/fantacalcio-poster.jpg"
            >
              <source src="/assets/fantacalcio-demo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <span className="project__title">{title}</span>
      </a>
    </article>
  )
}

export default function Work() {
  return (
    <section className="work" id="work">
      <h2 className="wordmark section-head">Work</h2>
      <div className="grid">
        <Project
          label="Web App"
          title="Fantacalcio"
          href="https://github.com/Domenico-lel/fantacalcio"
        />
      </div>
    </section>
  )
}
