import { useState } from 'react'

// Submissions are delivered by FormSubmit (https://formsubmit.co) — free, no
// account and no API key. Set this to the email where you want messages to
// arrive. The FIRST time the form is submitted, FormSubmit emails you a one-time
// activation link; click it once and every submission after that lands in your
// inbox.
const CONTACT_EMAIL = 'domenicolella2@gmail.com'
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    setError('')

    const data = new FormData(form)
    data.append('_subject', 'New message from your portfolio')
    data.append('_captcha', 'false')
    data.append('_template', 'table')

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      const json = await res.json()
      // FormSubmit returns success as the string "true".
      if (json.success === true || json.success === 'true') {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
        setError(json.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  return (
    <section className="contact" id="contact">
      <h2 className="wordmark section-head">Contact</h2>
      <p className="contact__lead">
        Have a project in mind, or just want to say hi? Send me a message and
        I&apos;ll get back to you.
      </p>

      <form className="contact__form" onSubmit={handleSubmit}>
        {/* Honeypot — bots fill this, humans never see it. FormSubmit drops any
            submission where its `_honey` field is filled. */}
        <input
          type="text"
          name="_honey"
          className="contact__honeypot"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="contact__row">
          <label className="contact__field">
            <span className="contact__label">Name</span>
            <input
              className="contact__input"
              type="text"
              name="name"
              placeholder="Your name"
              required
            />
          </label>
          <label className="contact__field">
            <span className="contact__label">Email</span>
            <input
              className="contact__input"
              type="email"
              name="email"
              placeholder="you@email.com"
              required
            />
          </label>
        </div>

        <label className="contact__field">
          <span className="contact__label">Message</span>
          <textarea
            className="contact__input contact__textarea"
            name="message"
            placeholder="Tell me about it…"
            rows={5}
            required
          />
        </label>

        <div className="contact__actions">
          <button
            className="pill pill--dark contact__submit"
            type="submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'success' && (
            <span className="contact__note contact__note--ok" role="status">
              Thanks — your message is on its way.
            </span>
          )}
          {status === 'error' && (
            <span className="contact__note contact__note--err" role="alert">
              {error}
            </span>
          )}
        </div>
      </form>

      <a className="contact__email" href="mailto:domenicolella2@gmail.com">
        domenicolella2@gmail.com
      </a>
    </section>
  )
}
