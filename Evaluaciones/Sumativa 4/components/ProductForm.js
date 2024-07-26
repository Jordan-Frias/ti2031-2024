// components/ProductForm.js
import { useState } from 'react';

const ProductForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [available, setAvailable] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = { id: Date.now(), name, available: parseInt(available) };
    onAdd(newProduct);
    setName('');
    setAvailable('');
  };

  return (
    <form onSubmit={handleSubmit} className="text-white mt-4">
      <input
        type="text"
        placeholder="Nombre del producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-1 m-1"
        required
      />
      <input
        type="number"
        placeholder="Cantidad disponible"
        value={available}
        onChange={(e) => setAvailable(e.target.value)}
        className="p-1 m-1"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-1 m-1 rounded">Agregar Producto</button>
    </form>
  );
};

export default ProductForm;


