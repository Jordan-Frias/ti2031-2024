// components/ProductList.js
const ProductList = ({ products, onDelete }) => {
    return (
      <div>
        <ul>
          {products.map(product => (
            <li key={product.id} className="text-white">
              {product.name} - {product.available} disponibles
              <button onClick={() => onDelete(product.id)} className="bg-red-500 text-white p-1 ml-2 rounded">Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ProductList;
  
  