import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7070";
const ALL_CATEGORY = { id: 0, title: "Все" };
const PAGE_SIZE = 6;

function Catalog({ title = "Каталог", withSearch = false }) {
  // Локальное состояние каталога: категории, выбранная категория, товары и статусы загрузки.
  const [categories, setCategories] = useState([ALL_CATEGORY]);
  const [activeCategoryId, setActiveCategoryId] = useState(ALL_CATEGORY.id);
  const [items, setItems] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isItemsLoading, setIsItemsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q")?.trim() ?? "";
  const [searchValue, setSearchValue] = useState(queryFromUrl);

  useEffect(() => {
    // Синхронизируем значение поля поиска с query-параметром URL.
    setSearchValue(queryFromUrl);
  }, [queryFromUrl]);

  // Формируем URL товаров в зависимости от выбранной категории.
  const itemsUrl = useMemo(() => {
    const url = new URL("/api/items", API_BASE_URL);

    if (activeCategoryId !== ALL_CATEGORY.id) {
      url.searchParams.set("categoryId", String(activeCategoryId));
    }

    if (withSearch && queryFromUrl) {
      url.searchParams.set("q", queryFromUrl);
    }

    return url.toString();
  }, [activeCategoryId, queryFromUrl, withSearch]);

  useEffect(() => {
    let isCancelled = false;

    async function loadCategories() {
      // Загружаем категории один раз при маунте компонента.
      setIsCategoriesLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        if (!response.ok) {
          throw new Error("Не удалось загрузить категории");
        }

        const data = await response.json();
        if (!isCancelled) {
          // По ТЗ добавляем категорию "Все" вручную.
          setCategories([ALL_CATEGORY, ...data]);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!isCancelled) {
          setIsCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadItems() {
      // Загружаем товары при первом рендере и при смене категории.
      setIsItemsLoading(true);
      setError("");
      setItems([]);
      setHasMore(false);

      try {
        const response = await fetch(itemsUrl);
        if (!response.ok) {
          throw new Error("Не удалось загрузить товары");
        }

        const data = await response.json();
        if (!isCancelled) {
          setItems(data);
          // Если пришло 6 товаров, показываем кнопку "Загрузить еще".
          setHasMore(data.length === PAGE_SIZE);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
          setItems([]);
          setHasMore(false);
        }
      } finally {
        if (!isCancelled) {
          setIsItemsLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      isCancelled = true;
    };
  }, [itemsUrl]);

  async function handleLoadMore() {
    // Догружаем следующую страницу товаров с учетом текущей категории.
    setIsLoadingMore(true);
    setError("");

    try {
      const url = new URL("/api/items", API_BASE_URL);
      url.searchParams.set("offset", String(items.length));

      if (activeCategoryId !== ALL_CATEGORY.id) {
        url.searchParams.set("categoryId", String(activeCategoryId));
      }

      if (withSearch && queryFromUrl) {
        url.searchParams.set("q", queryFromUrl);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Не удалось загрузить дополнительные товары");
      }

      const data = await response.json();
      setItems((prevItems) => [...prevItems, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    // Поиск запускается по submit и сохраняется в URL.
    const nextQuery = searchValue.trim();
    const nextParams = new URLSearchParams(searchParams);

    if (nextQuery) {
      nextParams.set("q", nextQuery);
    } else {
      nextParams.delete("q");
    }

    setSearchParams(nextParams);
  }

  return (
    <section className="catalog">
      <h2 className="text-center">{title}</h2>

      {withSearch && (
        <form className="catalog-search-form form-inline" onSubmit={handleSearchSubmit}>
          <input
            className="form-control"
            placeholder="Поиск"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </form>
      )}

      {/* Пока грузятся категории — показываем лоадер категорий. */}
      {isCategoriesLoading ? (
        <div className="preloader">
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : (
        <ul className="catalog-categories nav justify-content-center">
          {categories.map((category) => (
            <li className="nav-item" key={category.id}>
              <button
                type="button"
                className={`nav-link btn btn-link ${activeCategoryId === category.id ? "active" : ""}`}
                onClick={() => setActiveCategoryId(category.id)}
              >
                {category.title}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Единая ошибка запроса: категории или товары. */}
      {error && <p className="text-center text-danger">{error}</p>}

      {/* Пока грузятся товары — показываем отдельный лоадер товаров. */}
      {isItemsLoading ? (
        <div className="preloader">
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : (
        <>
          <div className="row">
            {items.map((item) => (
              // Карточка отдельного товара каталога.
              <div className="col-4" key={item.id}>
                <div className="card catalog-item-card">
                  <img
                    src={item.images[0]}
                    className="card-img-top img-fluid"
                    alt={item.title}
                  />
                  <div className="card-body">
                    <p className="card-text">{item.title}</p>
                    <p className="card-text">{item.price} руб.</p>
                    <Link
                      to={`/catalog/${item.id}.html`}
                      className="btn btn-outline-primary"
                    >
                      Заказать
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Блок постраничной загрузки товаров ("Загрузить еще"). */}
          {hasMore && (
            <div className="text-center">
              {isLoadingMore && (
                <div className="preloader">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              )}
              <button
                type="button"
                className="btn btn-outline-primary"
                disabled={isLoadingMore}
                onClick={handleLoadMore}
              >
                Загрузить ещё
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Catalog;
