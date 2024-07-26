let users = [
  { username: 'inacap', password: 'inacap2024' },
  { username: 'usuario2', password: 'contraseña2' },
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const { username, password } = req.body;
    users.push({ username, password });
    res.status(201).json({ message: 'Usuario creado' });
  } else if (req.method === 'DELETE') {
    const { username } = req.body;
    users = users.filter(user => user.username !== username);
    res.status(200).json({ message: 'Usuario eliminado' });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
