import React, { useEffect, useState } from 'react';
import './Dashboard.css';  // Import the CSS file

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products. Network response was not ok.');
      }
      const data = await response.json();

      const formattedProducts = data.map(product => ({
        ...product,
        price: parseFloat(product.price) || 0,
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatImageUrl = (imagePath) => {
    if (!imagePath) {
      return ''; // Return an empty string if the imagePath is undefined or null
    }
    return imagePath.startsWith('http') ? imagePath : `http://localhost:5000${imagePath}`;
  };

  return (
    <div>
      <h1>Product Dashboard</h1>
      <h2>Current Products</h2>
      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && products.length === 0 && <p>No products available.</p>}
      {products.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th className="th">Image</th>
              <th className="th">Name</th>
              <th className="th">Description</th>
              <th className="th">Category</th>
              <th className="th">Price</th>
              <th className="th">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.product_id}>
                <td className="td">
                  {product.image ? (
                    <img src={formatImageUrl(product.image)} alt={product.name} className="img" />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="td">{product.name}</td>
                <td className="td">{product.description}</td>
                <td className="td">{product.category_name}</td>
                <td className="td">
                  {new Intl.NumberFormat('en-ZA', {
                    style: 'currency',
                    currency: 'ZAR',
                  }).format(product.price)}
                </td>
                <td className="td">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
