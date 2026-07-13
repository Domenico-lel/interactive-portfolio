import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Bio from './components/Bio'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Loader from './components/Loader'
import { usePageReady } from './hooks/usePageReady'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  const ready = usePageReady()

  return (
    <>
      <Loader done={ready} />
      <div className={`app${ready ? ' app--ready' : ''}`}>
        <Nav />
        <main className="page">
          <Hero />
          <Work />
          <Bio />
          <Contact />
          <Footer />
        </main>
      </div>
      <Analytics />
    </>
  )
}
