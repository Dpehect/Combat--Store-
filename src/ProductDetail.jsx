import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart, useLocale } from './App';

export default function ProductDetail() {
  const { t, cat, fmt, productText, transColor, transSize } = useLocale();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch('/data/products.json')
      .then((r) => r.json())
      .then((data) => {
        const p = (data.products || []).find((x) => x.slug === slug);
        setProduct(p || null);
        if (p) { setColor(p.colors?.[0] ?? ''); setSize(p.sizes?.[0] ?? ''); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !color || !size) return;
    addToCart({ productId: product.id, slug: product.slug, name: product.name, image: product.image, price: product.price, color, size, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <main className="page"><div className="container loading">{t('loading')}</div></main>;
  if (!product) return <main className="page"><div className="container"><p>{t('notFound')}</p><button onClick={() => navigate('/')}>{t('back')}</button></div></main>;

  return (
    <>
      <Helmet>
        <title>{productText(product.name)} | Combat Store</title>
        <meta name="description" content={(productText(product.description) || '').slice(0, 155) + ((productText(product.description) || '').length > 155 ? '...' : '')} />
      </Helmet>
      <main className="page">
        <div className="container product-detail">
          <div className="product-detail-gallery"><img src={product.image} alt={productText(product.name)} /></div>
          <div className="product-detail-info">
            <span className="product-detail-category">{cat(product.category)}</span>
            <h1 className="product-detail-title">{productText(product.name)}</h1>
            <p className="product-detail-price">{fmt(product.price)}</p>
            <p className="product-detail-desc">{productText(product.description)}</p>
            {product.colors?.length > 0 && (
              <div className="product-option">
                <label>{t('color')}</label>
                <div className="option-buttons">
                  {product.colors.map((c) => (
                    <button key={c} type="button" className={color === c ? 'active' : ''} onClick={() => setColor(c)}>{transColor(c)}</button>
                  ))}
                </div>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div className="product-option">
                <label>{t('size')}</label>
                <div className="option-buttons">
                  {product.sizes.map((s) => (
                    <button key={s} type="button" className={size === s ? 'active' : ''} onClick={() => setSize(s)}>{transSize(s)}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="product-option">
              <label>{t('qty')}</label>
              <div className="quantity-wrap">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>
            <button type="button" className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart} disabled={added}>
              {added ? t('added') : t('addToCart')}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
