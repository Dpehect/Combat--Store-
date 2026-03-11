import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart, useLocale } from './App';

export default function Cart() {
  const { items, totalPrice, totalItems, updateQuantity, removeFromCart, setShipping, setOrderId, orderId, clearCart } = useCart();
  const { t, fmt, productText, transColor, transSize } = useLocale();
  const STEPS = [t('steps')[0], t('steps')[1], t('steps')[2], t('steps')[3]];
  const [step, setStep] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0);
  const [form, setForm] = useState({ fullName: '', address: '', city: '', phone: '', email: '', cardNumber: '', cardName: '', expiry: '', cvv: '' });

  const handleInput = (e) => { const { name, value } = e.target; setForm((f) => ({ ...f, [name]: value })); };

  const handleShippingNext = () => {
    if (!form.fullName?.trim() || !form.address?.trim() || !form.city?.trim() || !form.phone?.trim() || !form.email?.trim()) return;
    setShipping({ fullName: form.fullName, address: form.address, city: form.city, phone: form.phone, email: form.email });
    setStep(3);
  };

  const handlePaymentSubmit = () => {
    if (!form.cardNumber?.trim() || !form.cardName?.trim() || !form.expiry?.trim() || !form.cvv?.trim()) return;
    setOrderTotal(totalPrice);
    setOrderId('ORD-' + Date.now());
    setStep(4);
    clearCart();
  };

  return (
    <>
      <Helmet>
        <title>{t('cart')} | Combat Store</title>
        <meta name="description" content={t('cart')} />
      </Helmet>
      <main className="page cart-page">
        <div className="container">
          <h1 className="cart-page-title">{t('cart')} & {t('payment')}</h1>
          <div className="checkout-steps">
            {STEPS.map((label, i) => (
              <div key={label} className={`step-indicator ${i + 1 === step ? 'active' : ''} ${i + 1 < step ? 'done' : ''}`}>
                <span className="step-num">{i + 1}</span>
                <span className="step-label">{label}</span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <section className="cart-step">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <p>{t('empty')}</p>
                  <Link to="/" className="btn btn-primary">{t('shop')}</Link>
                </div>
              ) : (
                <>
                  <ul className="cart-list">
                    {items.map((item, index) => (
                      <li key={index} className="cart-item">
                        <img src={item.image} alt={productText(item.name)} className="cart-item-img" />
                        <div className="cart-item-info">
                          <Link to={`/urun/${item.slug}`} className="cart-item-name">{productText(item.name)}</Link>
                          <span className="cart-item-variant">{transColor(item.color)} / {transSize(item.size)}</span>
                          <p className="cart-item-price">{fmt(item.price)}</p>
                        </div>
                        <div className="cart-item-qty">
                          <button type="button" onClick={() => updateQuantity(index, item.quantity - 1)}>−</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                        </div>
                        <p className="cart-item-total">{fmt(item.price * item.quantity)}</p>
                        <button type="button" className="cart-item-remove" onClick={() => removeFromCart(index)}>×</button>
                      </li>
                    ))}
                  </ul>
                  <div className="cart-summary">
                    <p><strong>{t('total')} ({totalItems} {t('items')}):</strong> {fmt(totalPrice)}</p>
                    <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>{t('toShipping')}</button>
                  </div>
                </>
              )}
            </section>
          )}

          {step === 2 && (
            <section className="cart-step checkout-form-step">
              <h2>{t('shipping')}</h2>
              <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); handleShippingNext(); }}>
                <label>{t('fullName')} *</label><input type="text" name="fullName" value={form.fullName} onChange={handleInput} required />
                <label>{t('address')} *</label><input type="text" name="address" value={form.address} onChange={handleInput} required />
                <label>{t('city')} *</label><input type="text" name="city" value={form.city} onChange={handleInput} required />
                <label>{t('phone')} *</label><input type="tel" name="phone" value={form.phone} onChange={handleInput} required />
                <label>{t('email')} *</label><input type="email" name="email" value={form.email} onChange={handleInput} required />
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>{t('backBtn')}</button>
                  <button type="submit" className="btn btn-primary">{t('toPayment')}</button>
                </div>
              </form>
            </section>
          )}

          {step === 3 && (
            <section className="cart-step checkout-form-step">
              <h2>{t('payment')}</h2>
              <p className="order-summary-text">{t('orderAmount')}: <strong>{fmt(totalPrice)}</strong></p>
              <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); handlePaymentSubmit(); }}>
                <label>{t('cardName')} *</label><input type="text" name="cardName" value={form.cardName} onChange={handleInput} required />
                <label>{t('cardNumber')} *</label><input type="text" name="cardNumber" value={form.cardNumber} onChange={handleInput} required maxLength="19" />
                <div className="form-row">
                  <div><label>{t('expiry')} *</label><input type="text" name="expiry" value={form.expiry} onChange={handleInput} required maxLength="5" /></div>
                  <div><label>{t('cvv')} *</label><input type="text" name="cvv" value={form.cvv} onChange={handleInput} required maxLength="4" /></div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>{t('backBtn')}</button>
                  <button type="submit" className="btn btn-primary">{t('complete')}</button>
                </div>
              </form>
            </section>
          )}

          {step === 4 && (
            <section className="cart-step order-done">
              <div className="order-done-icon">✓</div>
              <h2>{t('orderDone')}</h2>
              <p className="order-id">{t('orderNo')}: <strong>{orderId}</strong></p>
              <p className="order-done-text">{t('total')}: <strong>{fmt(orderTotal)}</strong></p>
              <p className="order-done-text">{t('delivery')}</p>
              <Link to="/" className="btn btn-primary">{t('continue')}</Link>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
