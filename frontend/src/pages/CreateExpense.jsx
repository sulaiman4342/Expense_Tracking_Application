import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MdOutlineAddBox } from 'react-icons/md'
import { useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';

const CreateExpense = () => {
  const [expense, setExpense] = useState({
    title: '',
    category: '',
    description: '',
    amount: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/expenses/${id}`)
        .then((response) => {
          const formattedExpense = {
            ...response.data,
            date: response.data.date ? new Date(response.data.date).toISOString().substr(0, 10) : ''
          };
          setExpense(formattedExpense);
        })
        .catch((error) => {
          alert("Error in fetching expense");
          navigate('/');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/expenses', expense);
      if (!id) alert("Expense created successfully");
      else alert("Expense updated successfully");
      console.log(response);
    } catch (error) {
      alert("Error in creating expense");
      console.log(error);
    } finally {
      setLoading(false);
      navigate('/');
    }
  };

  return (
    loading ? 
      <Loading />
      :
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-700">{id ? "Update Expense" : "Create Expense"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={expense.title}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={expense.category}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a category</option>
                <option value="Food">Food</option>
                <option value="Household">Household</option>
                <option value="Social Life">Social Life</option>
                <option value="Transportation">Transportation</option>
                <option value="Health">Health</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={expense.description}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={expense.date}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className='flex justify-between p-10'>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {id ? "Update" : "Create Expense"}
              </button>
              <button className='px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
                <Link to='/' className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  Cancel
                </Link>
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CreateExpense;
