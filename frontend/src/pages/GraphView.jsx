import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';

Chart.register(CategoryScale);

const GraphView = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/expenses/summary')
      .then(response => {
        const data = response.data;

        if (!Array.isArray(data)) {
          setError('Invalid data format');
          setChartData({});
          return;
        }

        const categories = data.map(item => item._id);
        const amounts = data.map(item => item.totalAmount);

        const chartData = {
          labels: categories,
          datasets: [
            {
              label: 'Expenses',
              data: amounts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };

        setChartData(chartData);
        setError('');
      })
      .catch(error => {
        console.error('Error fetching summary data:', error);
        setError('Error fetching data');
        setChartData({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100 text-red-600">{error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Expense Summary</h2>
        {chartData.datasets && <Bar data={chartData} />} {/* Render chart only if chartData.datasets exists */}
      </div>
    </div>
  );
};

export default GraphView;
