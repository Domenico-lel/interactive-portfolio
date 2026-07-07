import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Bio from './components/Bio'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main className="page">
        <Hero />
        <Work />
        <Bio />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
