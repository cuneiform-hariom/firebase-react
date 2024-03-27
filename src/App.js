import React from 'react'
import SignUp from './pages/SignUp'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout'
import Login from './pages/Login'
import AddUser from './pages/AddUser'
import AllUsers from './pages/AllUsers'
import SingleUser from './pages/SingleUser'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='signup' element={<SignUp />} />
        <Route path='login' element={<Login />} />
        <Route path='adduser' element={<AddUser />} />
        <Route path='allusers' element={<AllUsers />} />
        <Route path='allusers/:id' element={<SingleUser />} />
      </Route>
    )
  )

  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  )
}

export default App
