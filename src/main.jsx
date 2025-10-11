import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from './components/Navbar/Navbar.jsx'
import App from './pages/App.jsx';
import Productos from './pages/Productos.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Registro/Registro.jsx';
import ProductPage from './pages/ProductPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/productos" element={<ProductPage />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/registro' element={<Register/>}/>
      </Routes>
  </BrowserRouter>
)
