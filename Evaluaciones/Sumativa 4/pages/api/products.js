let products = [
  { id: 1, name: 'Catan', available: 5 },
  { id: 2, name: 'Cthulhu', available: 3 },
  { id: 3, name: 'D&D', available: 2 },
  { id: 4, name: 'Dixit', available: 4 },
  { id: 5, name: 'Numenera', available: 6 },
  { id: 6, name: 'Pathfinder', available: 7 },
  { id: 7, name: 'Pictionary', available: 8 },
  { id: 8, name: 'Risk', available: 9 },
  { id: 9, name: 'TEG', available: 10 },
  { id: 10, name: 'Uno', available: 11 },
  { id: 11, name: 'Vampire', available: 12 },
  { id: 12, name: 'Warhammer', available: 13 },
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(products);
  } else if (req.method === 'POST') {
    const { id, name, available } = req.body;
    products.push({ id, name, available });
    res.status(201).json({ message: 'Producto creado' });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    products = products.filter(product => product.id !== id);
    res.status(200).json({ message: 'Producto eliminado' });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

