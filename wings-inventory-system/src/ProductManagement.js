import React, { useState, useEffect } from 'react';
import './App';  // Import the external CSS file

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products.');
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !description || !category || price === '' || quantity === '' || !image) {
      setError('Please fill in all fields.');
      return;
    }

    const productData = new FormData();
    productData.append('name', name);
    productData.append('description', description);
    productData.append('category_name', category);
    productData.append('price', parseFloat(price));
    productData.append('quantity', parseInt(quantity));
    productData.append('image', image);

    try {
      const existingProductIndex = products.findIndex(product => product.name === name);
      if (existingProductIndex >= 0) {
        const updatedProduct = {
          ...products[existingProductIndex],
          quantity: products[existingProductIndex].quantity + parseInt(quantity),
          description,
          category_name: category,
          price: parseFloat(price),
        };

        const response = await fetch(`http://localhost:5000/api/products/${products[existingProductIndex].product_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
          const updatedProducts = [...products];
          updatedProducts[existingProductIndex] = updatedProduct;
          setProducts(updatedProducts);
          setSuccess('Product updated successfully.');
        } else {
          setError('Failed to update the product. Please try again.');
        }
      } else {
        const response = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          body: productData,
        });

        if (response.ok) {
          const newProduct = await response.json();
          setProducts([...products, newProduct]);
          setSuccess('Product added successfully.');
        } else {
          setError('Failed to add the product. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again.');
    }

    setName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setQuantity('');
    setImage(null);
    setPreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setProducts(products.filter(product => product.product_id !== id));
          setSuccess('Product deleted successfully.');
        } else {
          setError('Failed to delete the product. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete the product. Please try again.');
      }
    }
  };

  const handleAddStock = async (id) => {
    const quantityToAdd = parseInt(prompt('Enter quantity to add:'));
    if (!isNaN(quantityToAdd) && quantityToAdd > 0) {
      const product = products.find(p => p.product_id === id);
      const updatedQuantity = product.quantity + quantityToAdd;
      const updatedProduct = { ...product, quantity: updatedQuantity };

      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: updatedQuantity }),
        });

        if (response.ok) {
          setProducts(products.map(p => (p.product_id === id ? updatedProduct : p)));
          setSuccess('Stock added successfully.');
        } else {
          setError('Failed to add stock. Please try again.');
        }
      } catch (error) {
        console.error('Error adding stock:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    } else {
      alert('Please enter a valid positive quantity.');
    }
  };

  const handleDeductStock = async (id) => {
    const quantityToDeduct = parseInt(prompt('Enter quantity to deduct:'));
    if (!isNaN(quantityToDeduct) && quantityToDeduct > 0) {
      const product = products.find(p => p.product_id === id);
      if (product && product.quantity >= quantityToDeduct) {
        try {
          const updatedQuantity = product.quantity - quantityToDeduct;
          const updatedProduct = { ...product, quantity: updatedQuantity };

          const response = await fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: updatedQuantity }),
          });

          if (response.ok) {
            setProducts(products.map(p => (p.product_id === id ? updatedProduct : p)));
            setSuccess('Stock deducted successfully.');
          } else {
            setError('Failed to deduct stock. Please try again.');
          }
        } catch (error) {
          console.error('Error deducting stock:', error);
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        alert('Insufficient stock to deduct this amount.');
      }
    } else {
      alert('Please enter a valid positive quantity.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="formContainer">
      <h2 className="formHeader">Product Management</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <label className="label">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        <label className="label">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
        <label className="label">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
        />
        <label className="label">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input"
        />
        <label className="label">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="input"
        />
        <label className="label">Product Image</label>
        <input type="file" onChange={handleImageChange} className="input" />
        {preview && <img src={preview} alt="Preview" className="imagePreview" />}
        <button type="submit" className="button">Add Product</button>
      </form>

      <h3>Product List</h3>
      <ul>
        {products.map((product) => (
          <li key={product.product_id}>
            <span>{product.name}</span>
            <span>{product.category_name}</span>
            <span>{product.quantity}</span>
            <span>{product.price}</span>
            <button onClick={() => handleAddStock(product.product_id)} className="manageButton addButton">Add Stock</button>
            <button onClick={() => handleDeductStock(product.product_id)} className="manageButton deductButton">Deduct Stock</button>
            <button onClick={() => handleDelete(product.product_id)} className="manageButton deleteButton">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;
