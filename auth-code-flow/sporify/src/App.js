
import './App.css';
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Boton from './components/boton';
import Home from './components/home';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
  
      <Route path="/" element={ <Boton /> } />
      {/* <Route path="/api/login" element= { <Login /> } /> */}
      <Route path="/home" element={ <Home /> } />
    
    </Routes>
    
    </BrowserRouter>

  
    </>
  )
}

export default App;
