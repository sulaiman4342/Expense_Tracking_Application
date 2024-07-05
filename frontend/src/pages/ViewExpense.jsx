import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import axios from 'axios';

export default function ViewExpense() {
    const [expense, setExpense] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:5000/api/expenses/${id}`)
            .then((response) => {
                setExpense(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <Loading/>;
    }

    if (!expense) {
        return <div>Expense not found</div>;
    }

  return (
    <div className='p-4'>
      <h1 className='text-3xl font-bold text-center mb-6'>View Expense</h1>
      <div className='bg-white border border-gray-300 rounded-lg p-4 shadow-md'>
        <h2 className='text-lg font-semibold mb-2'>{expense.title}</h2>
        <p className='text-gray-600 mb-2'>
          <span className='font-semibold'>Category:</span> {expense.category}
        </p>
        <p className='text-gray-600 mb-2'>
          <span className='font-semibold'>Amount:</span> {expense.amount}
        </p>
        <p className='text-gray-600 mb-2'>
          <span className='font-semibold'>Date:</span>{' '}
          {new Date(expense.date).toLocaleDateString()}
        </p>
        <p className='text-gray-600 mb-2'>
          <span className='font-semibold'>Description:</span> {expense.description}
        </p>

      </div>

    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
        <Link to= '/' >Back</Link>
    </button>

    </div>
    
  )
}
