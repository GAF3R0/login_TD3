import { useState } from 'react'
import './App.css'
import logo from './assets/logo2.png'
import INE from './components/Ine.jsx'

function App() {
  const [count, setCount] = useState(0)
 return(
  <>
  <INE/>{INE}
  </>
 )


 /*return (
    <>
      <div>
       
       <img src={logo}  class="logo" alt="Logo" />
   
       <h1>UNACH</h1>
       
       </div> 
         <p className="read-the-docs">
           Erick Gamaiel Fuentes Rodriguez 
         </p>
         <INE/>{INE}
    </>
  )*/
}

export default App
