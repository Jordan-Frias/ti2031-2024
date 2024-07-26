import { useState, useEffect } from 'react';
import Layout from '../components/layout';
import { useRouter } from 'next/router';

const Home = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [catalog, setCatalog] = useState([
    { id: 1, name: 'Catan', image: '/juegos/Catan.jpeg', available: 5, location: 'INACAP La Granja' },
    { id: 2, name: 'Cthulhu', image: '/juegos/Cthulhu.jpeg', available: 3, location: 'INACAP La Granja' },
    { id: 3, name: 'D&D', image: '/juegos/D&D.jpeg', available: 2, location: 'INACAP La Granja' },
    { id: 4, name: 'Dixit', image: '/juegos/Dixit.jpeg', available: 4, location: 'INACAP Renca' },
    { id: 5, name: 'Numenera', image: '/juegos/Numenera.jpeg', available: 6, location: 'INACAP Renca' },
    { id: 6, name: 'Pathfinder', image: '/juegos/pathfinder.jpeg', available: 7, location: 'INACAP Renca' },
    { id: 7, name: 'Pictionary', image: '/juegos/Pictionary.jpeg', available: 8, location: 'INACAP Ñuñoa' },
    { id: 8, name: 'Risk', image: '/juegos/Risk.jpeg', available: 9, location: 'INACAP Ñuñoa' },
    { id: 9, name: 'TEG', image: '/juegos/TEG.jpeg', available: 10, location: 'INACAP Ñuñoa' },
    { id: 10, name: 'Uno', image: '/juegos/Uno.jpeg', available: 11, location: 'INACAP Santiago Sur' },
    { id: 11, name: 'Vampire', image: '/juegos/Vampire.jpeg', available: 12, location: 'INACAP Santiago Sur' },
    { id: 12, name: 'Warhammer', image: '/juegos/Warhammer.jpeg', available: 13, location: 'INACAP Santiago Sur' },
  ]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    const savedLocation = localStorage.getItem('currentLocation');
    if (savedLocation) {
      setCurrentLocation(savedLocation);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('currentLocation', currentLocation);
  }, [cartItems, currentLocation]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      router.push('/admin');
    }
  }, [user, router]);

  const addToCart = (id) => {
    const item = catalog.find(product => product.id === id);
    if (item && item.available > 0) {
      if (cartItems.length === 0 || currentLocation === item.location) {
        const cartItem = cartItems.find(product => product.id === id);
        if (cartItem) {
          if (cartItem.quantity < item.available) {
            const updatedCart = cartItems.map(product =>
              product.id === id ? { ...product, quantity: product.quantity + 1 } : product
            );
            setCartItems(updatedCart);
          }
        } else {
          setCartItems([...cartItems, { ...item, quantity: 1 }]);
          setCurrentLocation(item.location);
        }
        const updatedCatalog = catalog.map(product =>
          product.id === id ? { ...product, available: product.available - 1 } : product
        );
        setCatalog(updatedCatalog);
      } else {
        alert('Solo puedes agregar juegos de la misma sede.');
      }
    }
  };

  const updateCartQuantity = (id, newQuantity) => {
    const cartItem = cartItems.find(product => product.id === id);
    if (cartItem) {
      const catalogItem = catalog.find(product => product.id === id);
      const difference = newQuantity - cartItem.quantity;
      if (difference <= catalogItem.available) {
        const updatedCart = cartItems.map(product =>
          product.id === id ? { ...product, quantity: newQuantity } : product
        );
        setCartItems(updatedCart);
        const updatedCatalog = catalog.map(product =>
          product.id === id ? { ...product, available: product.available - difference } : product
        );
        setCatalog(updatedCatalog);
      } else {
        alert('No hay suficientes productos disponibles.');
      }
    }
  };

  const removeFromCart = (id) => {
    const cartItem = cartItems.find(product => product.id === id);
    if (cartItem) {
      const catalogItem = catalog.find(product => product.id === id);
      const updatedCart = cartItems.filter(product => product.id !== id);
      setCartItems(updatedCart);
      if (updatedCart.length === 0) {
        setCurrentLocation(null);
      }
      const updatedCatalog = catalog.map(product =>
        product.id === id ? { ...product, available: product.available + cartItem.quantity } : product
      );
      setCatalog(updatedCatalog);
    }
  };

  const handleReservation = () => {
    alert(`Felicidades, has reservado los siguientes juegos:\n${cartItems.map(item => item.name).join(', ')}`);
    setCartItems([]);
    setCurrentLocation(null);
  };

  return (
    <Layout onLogin={setUser} user={user}>
      {user && <p className="text-white p-4">Bienvenido, {user.username}</p>}
      <section className="container mx-auto p-4">
        <h2 className="text-xl font-bold text-white">Catálogo de Productos</h2>
        <div className="grid grid-cols-3 gap-4">
          {catalog.map(item => (
            <div key={item.id} className="game p-4 border border-white rounded-lg">
              <img src={item.image} alt={item.name} className="mb-2 w-full h-48 object-cover"/>
              <p>{item.name}</p>
              <p>Sede: {item.location}</p>
              <p>Disponibles: {item.available}</p>
              <button onClick={() => addToCart(item.id)} disabled={!user} className="bg-blue-500 text-white p-1 mt-2 rounded">Agregar al Carro</button>
            </div>
          ))}
        </div>
      </section>
      <section className="container mx-auto p-4">
        <h2 className="text-xl font-bold text-white">Carro de Compras</h2>
        <div className="cart">
          {cartItems.length === 0 ? (
            <p>El carro está vacío.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item p-4 border border-white rounded-lg mb-2">
                <p>{item.name} - Cantidad:
                  <input 
                    type="number" 
                    min="1" 
                    max={item.available + item.quantity} 
                    value={item.quantity} 
                    onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))} 
                    className="p-1 ml-2 mr-2 border border-gray-400 rounded bg-white text-black"
                  />
                - Sede: {item.location}</p>
                <button onClick={() => removeFromCart(item.id)} className="bg-red-500 text-white p-1 mt-2 rounded">Eliminar</button>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <button onClick={handleReservation} className="bg-green-500 text-white p-2 mt-4 rounded">Reservar Juegos</button>
        )}
      </section>
    </Layout>
  );
};

export default Home;

