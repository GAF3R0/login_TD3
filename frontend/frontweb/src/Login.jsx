import React, { useState } from 'react';
import logo from './assets/logo2.png'
import './estilos/login.css'


function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí iría la lógica para enviar los datos al servidor
    console.log('Usuario:', username, 'Contraseña:', password);
  };
 
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo-placeholder">
         <img src={logo}  className="logo" alt="Logo" />
        </div>
           
           <h2 className="form-title">Iniciar sesión</h2>
           <p className="form-subtitle">Bienvenido a ABMODEL, Ingresa sus datos para acceder.</p>

        <div className="input-group">
         <label className='usuariocss'>Usuario:</label>
         <i className="fas fa-envelope icon"></i>
          <input
            type="text"
            placeholder="USUARIO"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
         <label className='contraseñacss'>Contraseña:</label>
         <i className="fas fa-lock icon"></i>
         <input
           type="password"
           placeholder="CONTRASEÑA"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
         />
        </div>

        <button className="login-button" type="submit">Iniciar Sesión</button>
      </form>
    </div>
   
  );
}

export default LoginForm;