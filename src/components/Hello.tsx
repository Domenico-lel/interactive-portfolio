import FitText from './FitText'

export default function Hello() {
  return (
    <section className="hello" id="contact">
      <h2 className="wordmark hello__mark">
        <FitText max={240}>domenicolella2@gmai.com</FitText>
      </h2>
    </section>
  )
}
