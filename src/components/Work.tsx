function Project({
  label,
  title,
  href,
  video,
  poster,
}: {
  label: string
  title: string
  href: string
  video: string
  poster: string
}) {
  return (
    <article className="project">
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
              poster={poster}
            >
              <source src={video} type="video/mp4" />
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
          video="/assets/fantacalcio-demo.mp4"
          poster="/assets/fantacalcio-poster.jpg"
        />
        <Project
          label="Web App"
          title="Prompt Builder"
          href="https://github.com/Domenico-lel/prompt-builder"
          video="/assets/prompt-builder-demo.mp4"
          poster="/assets/prompt-builder-poster.jpg"
        />
        <Project
          label="Web App"
          title="Spotify Clone"
          href="https://github.com/Domenico-lel/spotify-youtube-clone"
          video="/assets/spotify-clone-demo.mp4"
          poster="/assets/spotify-clone-poster.jpg"
        />
      </div>
    </section>
  )
}
