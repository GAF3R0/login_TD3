import { useState } from 'react'
import './App.css'
import Login from './Login'

function App() {
  const [count, setCount] = useState(0)

 return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <Login /> {}
      </main>
    </div>
  );
 /*return (
    <>
      <div>
       
       <img src={logo}  class="logo" alt="Logo" />;
   
       <h1>UNACH</h1>
       
      </div> 
       <p className="read-the-docs">
        Erick Gamaiel Fuentes 
      </p>
    </>
  )*/
}//Pérez

export default App
