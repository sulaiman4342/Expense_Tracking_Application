import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import CreateExpense from './pages/CreateExpense';
import GraphView from './pages/GraphView';
import ViewExpense from './pages/ViewExpense';


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='add' element={<CreateExpense />}/>
      <Route path='/edit/:id' element={<CreateExpense />}/>
      <Route path='/graph' element={<GraphView />}/>
      <Route path='/view/:id' element={<ViewExpense />}/>

    </Routes>
  )
}

export default App