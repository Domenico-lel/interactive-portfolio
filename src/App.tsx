import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Bio from './components/Bio'
import Hello from './components/Hello'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main className="page">
        <Hero />
        <Work />
        <Bio />
        <Hello />
        <Footer />
      </main>
    </>
  )
}
