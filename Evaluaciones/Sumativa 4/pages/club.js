import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { useRouter } from 'next/router';

const Club = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (!loggedUser || loggedUser.username === 'Admin') {
      router.push('/');
    } else {
      setUser(loggedUser);
      fetchCatalog();
    }
  }, []);

  const fetchCatalog = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setCatalog(data);
  };

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
    <Layout>
      <h1 className="text-2xl font-bold text-white">Bienvenido al Club, {user && user.username}</h1>
      <section className="container mx-auto p-4">
        <h2 className="text-xl font-bold text-white">Catálogo de Productos</h2>
        <div className="grid grid-cols-3 gap-4">
          {catalog.map(item => (
            <div key={item.id} className="game p-4 border border-white rounded-lg">
              <img src={item.image} alt={item.name} className="mb-2 w-full h-48 object-cover"/>
              <p>{item.name}</p>
              <p>Sede: {item.location}</p>
              <p>Disponibles: {item.available}</p>
              <button onClick={() => addToCart(item.id)} disabled={!user} className="bg-blue-500 text-white p-1 mt-2 rounded">Agregar al Carrito</button>
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

export default Club;
