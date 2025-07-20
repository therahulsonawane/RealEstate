import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { Header } from './components/Header'
import './index.css'
import { PrivateRoute } from './components/PrivateRoute'
import { CreateListing } from './pages/CreateListing'
import { Listing } from './pages/Listing'
import { PropertyEdit } from './pages/PropertyEdit'
import { Search } from './pages/Search'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/propertyEdit/:id' element={<PropertyEdit />} />
        </Route>
        <Route path='/Search' element={<Search />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/listing/:id' element={<Listing />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
