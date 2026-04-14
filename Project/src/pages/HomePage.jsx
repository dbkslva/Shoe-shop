import Banner from '../components/Banner'

function HomePage() {
  return (
    <>
      <Banner />
      <section className="top-sales">
        <h2 className="text-center">Хиты продаж!</h2>
      </section>
      <section className="catalog">
        <h2 className="text-center">Каталог</h2>
      </section>
    </>
  )
}

export default HomePage
