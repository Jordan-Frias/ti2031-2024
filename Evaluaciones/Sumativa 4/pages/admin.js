import { useState, useEffect } from 'react';
import Layout from '../components/layout';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';

const Admin = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data));

    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  const handleAddProduct = (newProduct) => {
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    }).then(() => {
      setProducts([...products, newProduct]);
    });
  };

  const handleDeleteProduct = (productId) => {
    fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId }),
    }).then(() => {
      setProducts(products.filter(product => product.id !== productId));
    });
  };

  const handleAddUser = (newUser) => {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).then(() => {
      setUsers([...users, newUser]);
    });
  };

  const handleDeleteUser = (username) => {
    fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    }).then(() => {
      setUsers(users.filter(user => user.username !== username));
    });
  };

  if (!user || user.role !== 'admin') {
    return <p className="text-white">No tienes permiso para acceder a esta página</p>;
  }

  return (
    <Layout user={user}>
      <section className="container mx-auto p-4">
        <h2 className="text-xl font-bold text-white">Panel de Administración</h2>
        
        <div>
          <h3 className="text-lg font-bold text-white">Productos</h3>
          <ProductList products={products} onDelete={handleDeleteProduct} />
          <ProductForm onAdd={handleAddProduct} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Usuarios</h3>
          <UserList users={users} onDelete={handleDeleteUser} />
          <UserForm onAdd={handleAddUser} />
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
