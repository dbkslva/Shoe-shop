import Banner from '../components/Banner'
import Catalog from '../components/Catalog'

function HomePage() {
  return (
    <>
      <Banner />
      <section className="top-sales">
        <h2 className="text-center">Хиты продаж!</h2>
      </section>
      <Catalog />
    </>
  )
}

export default HomePage
