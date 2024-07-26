// components/UserForm.js
import { useState } from 'react';

const UserForm = ({ onAdd }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { username, password };
    onAdd(newUser);
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="text-white mt-4">
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-1 m-1"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-1 m-1"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-1 m-1 rounded">Agregar Usuario</button>
    </form>
  );
};

export default UserForm;

