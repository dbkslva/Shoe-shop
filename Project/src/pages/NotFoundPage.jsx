import Banner from '../components/Banner'

function NotFoundPage() {
  return (
    <>
      <Banner />
      <section className="top-sales">
        <h2 className="text-center">Страница не найдена</h2>
        <p>Извините, такая страница не найдена!</p>
      </section>
    </>
  )
}

export default NotFoundPage
