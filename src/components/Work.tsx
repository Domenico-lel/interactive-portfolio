function Project({ label, wide }: { label: string; wide?: boolean }) {
  return (
    <article className={`project${wide ? ' project--wide' : ''}`}>
      <span className="project__label">{label}</span>
      <div className={`card ${wide ? 'card--wide' : 'card--tall'}`}>
        <div className={`device ${wide ? 'device--tablet' : 'device--phone'}`} />
      </div>
    </article>
  )
}

export default function Work() {
  return (
    <section className="work" id="work">
      <h2 className="wordmark section-head">Work</h2>
      <div className="grid">
        <Project label="Project Name" wide />
        <Project label="Project Name" />
        <Project label="Project Name" />
      </div>
    </section>
  )
}
