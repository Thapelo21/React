import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QuantityChart = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const chartData = {
    labels: products.map(product => product.name), // Product names as labels on the x-axis
    datasets: [
      {
        label: 'Product Quantities',
        data: products.map(product => product.quantity), // Product quantities as data for the bar chart
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color of the bars
      },
    ],
  };

  return (
    <div>
      <h2>Product Quantity Chart</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default QuantityChart;
