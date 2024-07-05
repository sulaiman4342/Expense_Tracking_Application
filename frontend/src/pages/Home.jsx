import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Loading from '../../components/Loading';
import GraphView from './GraphView';

const Home = () => {
  const [expenses, setExpenses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
    const [showList, setShowList] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5000/api/expenses')
      .then((response) => {
        setExpenses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const deleteExpense = async (id) => {
    setLoading(true);
    setShowDeleteConfirmation(false);
    try {
      const response = await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      console.log(response);
      alert("Expense deleted successfully");
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.log(error);
      alert("Error in deleting expense");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (showDeleteConfirmation) {
    return (
      <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
        <div className='bg-white p-4 rounded-md'>
          <h1 className='text-2xl'>Are you sure you want to delete this expense?</h1>
          <div className='flex justify-center gap-x-4'>
            <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => deleteExpense(deleteId)}>
              Yes
            </button>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => setShowDeleteConfirmation(false)}>
              No
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4'>
 <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
 onClick={() => setShowList(!showList)}
 >
    <span className="mr-2">{showList ? 'Graph View' : 'List View'}</span>
    <i className="fas fa-toggle-on"></i>
  </button>
      {expenses && expenses.length > 0  ? (
        showList ?
        <>
          <div className='flex justify-center items-center'>
            {/* toggle button */}
           
            <h1 className='text-3xl my-8'>Expenses List</h1>
            <Link to='/add'>
              <MdOutlineAddBox className='text-sky-800 text-4xl' />
            </Link>
          </div>
          <table className='w-full border-separate border-spacing-2'>
            <thead>
              <tr>
                <th className='border border-slate-600 rounded-md'>No</th>
                <th className='border border-slate-600 rounded-md'>Title</th>
                <th className='border border-slate-600 rounded-md max-md:hidden'>
                  Category
                </th>
                <th className='border border-slate-600 rounded-md max-md:hidden'>
                  Amount
                </th>
                <th className='border border-slate-600 rounded-md'>Date</th>
                <th className='border border-slate-600 rounded-md'>Description</th>
                <th className='border border-slate-600 rounded-md'>Operations</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={expense._id} className='h-8'>
                  <td className='border border-slate-700 rounded-md text-center'>
                    {index + 1}
                  </td>
                  <td className='border border-slate-700 rounded-md text-center'>
                    {expense.title}
                  </td>
                  <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                    {expense.category}
                  </td>
                  <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                    {expense.amount}
                  </td>
                  <td className='border border-slate-700 rounded-md text-center'>
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                    {expense.description}
                  </td>
                  <td className='border border-slate-700 rounded-md text-center'>
                    <div className='flex justify-center gap-x-4'>
                      <Link to={`/view/${expense._id}`}>
                        <BsInfoCircle className='text-2xl text-green-800' />
                      </Link>
                      <Link to={`/edit/${expense._id}`}>
                        <AiOutlineEdit className='text-2xl text-yellow-600' />
                      </Link>
                      <button onClick={() => { setShowDeleteConfirmation(true); setDeleteId(expense._id); }}>
                        <MdOutlineDelete className='text-2xl text-red-600' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
        :
        <GraphView/>
      ) : (
        <div className='flex flex-col justify-center gap-6'>
          <h1 className='text-2xl text-center'>No expenses found</h1>
          <button className='mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            <Link to='/add'>Add Expense</Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
