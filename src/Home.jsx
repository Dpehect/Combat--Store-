import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLocale } from './App';

export default function Home() {
  const { t, cat, fmt, productText } = useLocale();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('kategori') || '';

  useEffect(() => {
    fetch('/data/products.json')
      .then((r) => r.json())
      .then((data) => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
    return ['', ...cats];
  }, [products]);

  const filtered = !category ? products : products.filter((p) => p.category === category);

  return (
    <>
      <Helmet>
        <title>{t('pageTitle')}</title>
        <meta name="description" content={t('pageDesc')} />
      </Helmet>
      <main className="page">
        <div className="container">
          <header className="page-header">
            <h1>{t('products')}</h1>
            <p className="page-subtitle">{t('discover')}</p>
            <div className="categories">
              {categories.map((c) => (
                <button
                  key={c || 'all'}
                  type="button"
                  className={!category && !c ? 'active' : category === c ? 'active' : ''}
                  onClick={() => setSearchParams(c ? { kategori: c } : {})}
                >
                  {c ? cat(c) : t('all')}
                </button>
              ))}
            </div>
          </header>
          {loading ? (
            <div className="loading">{t('loading')}</div>
          ) : (
            <section className="product-grid" aria-label="Ürün listesi">
              {filtered.map((product) => (
                <article key={product.id} className="product-card">
                  <Link to={`/urun/${product.slug}`}>
                    <div className="product-card-image">
                      <img src={product.image} alt={productText(product.name)} loading="lazy" />
                    </div>
                    <div className="product-card-body">
                      <span className="product-card-category">{cat(product.category)}</span>
                      <h2 className="product-card-title">{productText(product.name)}</h2>
                      <p className="product-card-price">{fmt(product.price)}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
