import { createContext, useContext, useReducer, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './Home';
import ProductDetail from './ProductDetail';
import Cart from './Cart';

const LOCALES = [
  { id: 'tr', name: 'Türkçe', region: 'TR', currency: 'TRY', symbol: '₺', rate: 1 },
  { id: 'en', name: 'English', region: 'UK', currency: 'GBP', symbol: '£', rate: 0.023 },
  { id: 'de', name: 'Deutsch', region: 'EU', currency: 'EUR', symbol: '€', rate: 0.027 },
  { id: 'fr', name: 'Français', region: 'EU', currency: 'EUR', symbol: '€', rate: 0.027 },
  { id: 'pt', name: 'Português', region: 'EU', currency: 'EUR', symbol: '€', rate: 0.027 },
  { id: 'es', name: 'Español', region: 'EU', currency: 'EUR', symbol: '€', rate: 0.027 },
];
const T = {
  tr: { products: 'Ürünler', cart: 'Sepet', all: 'Tümü', pageTitle: 'Combat Store | Online Alışveriş', pageDesc: 'Kaliteli giyim, ayakkabı ve aksesuar. Güvenli alışveriş, hızlı teslimat.', loading: 'Yükleniyor...', discover: 'En çok tercih edilen ürünlerimizi keşfedin.', color: 'Renk', size: 'Beden', qty: 'Adet', addToCart: 'Sepete Ekle', added: 'Sepete Eklendi ✓', notFound: 'Ürün bulunamadı.', back: 'Ürünlere Dön', steps: ['Sepet', 'Teslimat', 'Ödeme', 'Onay'], empty: 'Sepetiniz boş.', shop: 'Alışverişe Başla', total: 'Toplam', items: 'ürün', shipping: 'Teslimat Bilgileri', payment: 'Ödeme Bilgileri', orderAmount: 'Sipariş tutarı', fullName: 'Ad Soyad', address: 'Adres', city: 'Şehir', phone: 'Telefon', email: 'E-posta', cardName: 'Kart Üzerindeki İsim', cardNumber: 'Kart Numarası', expiry: 'Son Kullanma', cvv: 'CVV', backBtn: 'Geri', toPayment: 'Ödemeye Geç', complete: 'Siparişi Tamamla', orderDone: 'Siparişiniz Alındı', orderNo: 'Sipariş no', delivery: 'Teslimat adresinize en kısa sürede ulaşacaktır.', continue: 'Alışverişe Devam Et', toShipping: 'Teslimat Bilgilerine Geç' },
  en: { products: 'Products', cart: 'Cart', all: 'All', pageTitle: 'Combat Store | Online Shopping', pageDesc: 'Quality clothing, shoes and accessories. Secure shopping, fast delivery.', loading: 'Loading...', discover: 'Discover our most popular products.', color: 'Color', size: 'Size', qty: 'Qty', addToCart: 'Add to Cart', added: 'Added ✓', notFound: 'Product not found.', back: 'Back to Products', steps: ['Cart', 'Shipping', 'Payment', 'Confirm'], empty: 'Your cart is empty.', shop: 'Start Shopping', total: 'Total', items: 'items', shipping: 'Shipping Details', payment: 'Payment Details', orderAmount: 'Order total', fullName: 'Full Name', address: 'Address', city: 'City', phone: 'Phone', email: 'Email', cardName: 'Card Name', cardNumber: 'Card Number', expiry: 'Expiry', cvv: 'CVV', backBtn: 'Back', toPayment: 'Continue to Payment', complete: 'Complete Order', orderDone: 'Order Confirmed', orderNo: 'Order no', delivery: 'Your order will arrive soon.', continue: 'Continue Shopping', toShipping: 'Continue to Shipping' },
  de: { products: 'Produkte', cart: 'Warenkorb', all: 'Alle', pageTitle: 'Combat Store | Online-Shop', pageDesc: 'Qualität Kleidung, Schuhe und Accessoires. Sichere Bestellung, schnelle Lieferung.', loading: 'Laden...', discover: 'Entdecken Sie unsere beliebtesten Produkte.', color: 'Farbe', size: 'Größe', qty: 'Anzahl', addToCart: 'In den Warenkorb', added: 'Hinzugefügt ✓', notFound: 'Produkt nicht gefunden.', back: 'Zurück', steps: ['Warenkorb', 'Versand', 'Zahlung', 'Bestätigung'], empty: 'Ihr Warenkorb ist leer.', shop: 'Einkaufen', total: 'Gesamt', items: 'Artikel', shipping: 'Versandadresse', payment: 'Zahlungsdaten', orderAmount: 'Bestellsumme', fullName: 'Name', address: 'Adresse', city: 'Stadt', phone: 'Telefon', email: 'E-Mail', cardName: 'Karteninhaber', cardNumber: 'Kartennummer', expiry: 'Gültig bis', cvv: 'CVV', backBtn: 'Zurück', toPayment: 'Weiter zur Zahlung', complete: 'Bestellung abschließen', orderDone: 'Bestellung bestätigt', orderNo: 'Bestellung Nr.', delivery: 'Ihre Bestellung wird bald geliefert.', continue: 'Weiter einkaufen', toShipping: 'Weiter zum Versand' },
  fr: { products: 'Produits', cart: 'Panier', all: 'Tous', pageTitle: 'Combat Store | Achat en ligne', pageDesc: 'Vêtements, chaussures et accessoires de qualité. Achats sécurisés, livraison rapide.', loading: 'Chargement...', discover: 'Découvrez nos produits les plus populaires.', color: 'Couleur', size: 'Taille', qty: 'Quantité', addToCart: 'Ajouter au panier', added: 'Ajouté ✓', notFound: 'Produit introuvable.', back: 'Retour', steps: ['Panier', 'Livraison', 'Paiement', 'Confirmation'], empty: 'Votre panier est vide.', shop: 'Commencer', total: 'Total', items: 'articles', shipping: 'Adresse de livraison', payment: 'Paiement', orderAmount: 'Montant', fullName: 'Nom', address: 'Adresse', city: 'Ville', phone: 'Téléphone', email: 'E-mail', cardName: 'Nom sur la carte', cardNumber: 'Numéro de carte', expiry: 'Date d\'exp.', cvv: 'CVV', backBtn: 'Retour', toPayment: 'Paiement', complete: 'Valider', orderDone: 'Commande confirmée', orderNo: 'N° commande', delivery: 'Votre commande arrivera bientôt.', continue: 'Continuer', toShipping: 'Livraison' },
  pt: { products: 'Produtos', cart: 'Carrinho', all: 'Todos', pageTitle: 'Combat Store | Compras online', pageDesc: 'Roupas, sapatos e acessórios de qualidade. Compras seguras, entrega rápida.', loading: 'Carregando...', discover: 'Descubra nossos produtos mais populares.', color: 'Cor', size: 'Tamanho', qty: 'Qtd', addToCart: 'Adicionar', added: 'Adicionado ✓', notFound: 'Produto não encontrado.', back: 'Voltar', steps: ['Carrinho', 'Envio', 'Pagamento', 'Confirmação'], empty: 'Seu carrinho está vazio.', shop: 'Comprar', total: 'Total', items: 'itens', shipping: 'Endereço', payment: 'Pagamento', orderAmount: 'Total', fullName: 'Nome', address: 'Endereço', city: 'Cidade', phone: 'Telefone', email: 'E-mail', cardName: 'Nome no cartão', cardNumber: 'Número do cartão', expiry: 'Validade', cvv: 'CVV', backBtn: 'Voltar', toPayment: 'Pagamento', complete: 'Finalizar', orderDone: 'Pedido confirmado', orderNo: 'Pedido n°', delivery: 'Seu pedido chegará em breve.', continue: 'Continuar comprando', toShipping: 'Envio' },
  es: { products: 'Productos', cart: 'Carrito', all: 'Todos', pageTitle: 'Combat Store | Compras online', pageDesc: 'Ropa, zapatos y accesorios de calidad. Compras seguras, entrega rápida.', loading: 'Cargando...', discover: 'Descubre nuestros productos más populares.', color: 'Color', size: 'Talla', qty: 'Cant', addToCart: 'Añadir al carrito', added: 'Añadido ✓', notFound: 'Producto no encontrado.', back: 'Volver', steps: ['Carrito', 'Envío', 'Pago', 'Confirmación'], empty: 'Tu carrito está vacío.', shop: 'Comprar', total: 'Total', items: 'artículos', shipping: 'Dirección de envío', payment: 'Pago', orderAmount: 'Total del pedido', fullName: 'Nombre', address: 'Dirección', city: 'Ciudad', phone: 'Teléfono', email: 'Correo', cardName: 'Nombre en la tarjeta', cardNumber: 'Número de tarjeta', expiry: 'Caducidad', cvv: 'CVV', backBtn: 'Atrás', toPayment: 'Continuar al pago', complete: 'Finalizar pedido', orderDone: 'Pedido confirmado', orderNo: 'Pedido n°', delivery: 'Tu pedido llegará pronto.', continue: 'Seguir comprando', toShipping: 'Continuar al envío' },
};
const CAT = { Aksesuar: { tr: 'Aksesuar', en: 'Accessories', de: 'Accessoires', fr: 'Accessoires', pt: 'Acessórios', es: 'Accesorios' }, Giyim: { tr: 'Giyim', en: 'Clothing', de: 'Kleidung', fr: 'Vêtements', pt: 'Roupas', es: 'Ropa' }, Ayakkabı: { tr: 'Ayakkabı', en: 'Shoes', de: 'Schuhe', fr: 'Chaussures', pt: 'Sapatos', es: 'Sapatos' } };
const COLORS = { Siyah: { tr: 'Siyah', en: 'Black', de: 'Schwarz', fr: 'Noir', pt: 'Preto', es: 'Negro' }, Beyaz: { tr: 'Beyaz', en: 'White', de: 'Weiß', fr: 'Blanc', pt: 'Branco', es: 'Blanco' }, Kahverengi: { tr: 'Kahverengi', en: 'Brown', de: 'Braun', fr: 'Marron', pt: 'Marrom', es: 'Marrón' }, Bordo: { tr: 'Bordo', en: 'Burgundy', de: 'Bordeaux', fr: 'Bordeaux', pt: 'Bordô', es: 'Borgoña' }, Lacivert: { tr: 'Lacivert', en: 'Navy', de: 'Marine', fr: 'Marine', pt: 'Azul-marinho', es: 'Azul marino' }, Gri: { tr: 'Gri', en: 'Grey', de: 'Grau', fr: 'Gris', pt: 'Cinza', es: 'Gris' }, Kırmızı: { tr: 'Kırmızı', en: 'Red', de: 'Rot', fr: 'Rouge', pt: 'Vermelho', es: 'Rojo' }, 'Açık Mavi': { tr: 'Açık Mavi', en: 'Light Blue', de: 'Hellblau', fr: 'Bleu clair', pt: 'Azul claro', es: 'Azul claro' }, 'Koyu Mavi': { tr: 'Koyu Mavi', en: 'Dark Blue', de: 'Dunkelblau', fr: 'Bleu foncé', pt: 'Azul escuro', es: 'Azul oscuro' }, Gümüş: { tr: 'Gümüş', en: 'Silver', de: 'Silber', fr: 'Argent', pt: 'Prata', es: 'Plata' }, Altın: { tr: 'Altın', en: 'Gold', de: 'Gold', fr: 'Or', pt: 'Dourado', es: 'Dorado' } };

const SIZES = { 
  'Tek Ebat': { tr: 'Tek Ebat', en: 'One Size', de: 'Einheitsgröße', fr: 'Taille unique', pt: 'Tamanho único', es: 'Talla única' },
  '10oz': { tr: '10oz', en: '10oz', de: '10oz', fr: '10oz', pt: '10oz', es: '10oz' },
  '12oz': { tr: '12oz', en: '12oz', de: '12oz', fr: '12oz', pt: '12oz', es: '12oz' },
  '14oz': { tr: '14oz', en: '14oz', de: '14oz', fr: '14oz', pt: '14oz', es: '14oz' },
  '16oz': { tr: '16oz', en: '16oz', de: '16oz', fr: '16oz', pt: '16oz', es: '16oz' }
};
const CartContext = createContext(null);
const LocaleContext = createContext(null);
const initialState = { items: [], shipping: null, orderId: null };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId && i.color === action.payload.color && i.size === action.payload.size
      );
      if (existing) {
        return { ...state, items: state.items.map((i) => i === existing ? { ...i, quantity: i.quantity + action.payload.quantity } : i) };
      }
      return { ...state, items: [...state.items, { ...action.payload }] };
    }
    case 'REMOVE_ITEM': return { ...state, items: state.items.filter((_, i) => i !== action.payload) };
    case 'UPDATE_QUANTITY':
      return { ...state, items: state.items.map((item, i) => i === action.payload.index ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item) };
    case 'SET_SHIPPING': return { ...state, shipping: action.payload };
    case 'SET_ORDER_ID': return { ...state, orderId: action.payload };
    case 'CLEAR_CART': return initialState;
    default: return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return (
    <CartContext.Provider value={{
      items: state.items,
      shipping: state.shipping,
      orderId: state.orderId,
      totalItems,
      totalPrice,
      addToCart: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
      removeFromCart: (i) => dispatch({ type: 'REMOVE_ITEM', payload: i }),
      updateQuantity: (i, q) => dispatch({ type: 'UPDATE_QUANTITY', payload: { index: i, quantity: q } }),
      setShipping: (d) => dispatch({ type: 'SET_SHIPPING', payload: d }),
      setOrderId: (id) => dispatch({ type: 'SET_ORDER_ID', payload: id }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    const s = localStorage.getItem('locale');
    return s && LOCALES.find((l) => l.id === s) ? s : 'tr';
  });
  const loc = LOCALES.find((l) => l.id === locale) || LOCALES[0];
  const t = (key) => T[locale]?.[key] ?? T.tr[key] ?? key;
  const cat = (key) => CAT[key]?.[locale] ?? key;
  const fmt = (tryPrice) => {
    const n = tryPrice * loc.rate;
    const opts = loc.currency === 'TRY' ? { minimumFractionDigits: 0 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return n.toLocaleString(locale === 'tr' ? 'tr-TR' : locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-GB', opts) + ' ' + loc.symbol;
  };
  const productText = (obj) => (typeof obj === 'object' && obj && obj[locale] ? obj[locale] : obj || '');
  const transColor = (c) => (COLORS[c]?.[locale] ?? c);
  const transSize = (s) => (SIZES[s]?.[locale] ?? s);
  return (
    <LocaleContext.Provider value={{ locale, setLocale, loc, t, cat, fmt, productText, transColor, transSize, LOCALES }}>
      {children}
    </LocaleContext.Provider>
  );
}

function Header() {
  const { totalItems } = useCart();
  const { t, locale, setLocale, LOCALES } = useLocale();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          {'Combat Store'.split('').map((c, i) => (
            <span key={i} className="logo-char" style={{ animationDelay: `${i * 0.08}s` }}>{c}</span>
          ))}
        </Link>
        <nav>
          <select className="lang-select" value={locale} onChange={(e) => { setLocale(e.target.value); localStorage.setItem('locale', e.target.value); }}>
            {LOCALES.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <Link to="/">{t('products')}</Link>
          <Link to="/sepet" className="cart-link">
            {t('cart')}
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <LocaleProvider>
        <CartProvider>
          <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/urun/:slug" element={<ProductDetail />} />
          <Route path="/sepet" element={<Cart />} />
        </Routes>
      </CartProvider>
      </LocaleProvider>
    </HelmetProvider>
  );
}
