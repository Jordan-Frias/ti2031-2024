import { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/users');
    const users = await response.json();

    if (username === 'Administrador' && password === 'inacap1') {
      setMessage(`Bienvenido, Admin`);
      onLogin({ username: 'Admin', role: 'admin' });
    } else {
      const user = users.find(user => user.username === username && user.password === password);
      if (user) {
        setMessage(`Bienvenido, ${username}`);
        onLogin({ username, role: 'user' });
      } else {
        setMessage('Usuario o contraseña incorrectos');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <form onSubmit={handleLogin} className="flex items-center">
        <input
          type="text"
          placeholder="Usuario"
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
        <button type="submit" className="bg-blue-500 text-white p-1 m-1 rounded">Iniciar Sesión</button>
      </form>
      {message && <p className="mt-2 text-white">{message}</p>}
    </div>
  );
};

export default LoginForm;


