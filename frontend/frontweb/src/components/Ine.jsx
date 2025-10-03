import React, { useState } from 'react';

// --- Componente principal: EstudiantesApp ---
const EstudiantesApp = () => {
  
  // 1. Estado para manejar los datos del formulario (registro o edición)
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
  });

  // 2. Estado para manejar la lista de estudiantes
  const [estudiantes, setEstudiantes] = useState([]); 

  // 3. Nuevo estado: Para saber si estamos en modo edición (true/false)
  const [isEditing, setIsEditing] = useState(false);

  // 4. Nuevo estado: Para guardar el Documento original del estudiante que estamos editando
  const [originalDocumento, setOriginalDocumento] = useState(null);


  // -------------------------------------------------------------------
  // --- A. Manejo de Formularios ---
  // -------------------------------------------------------------------

  // Maneja los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Maneja el envío del formulario (tanto para registrar como para editar)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica: asegura que todos los campos tengan algún valor
    if (Object.values(formData).some(value => !value.trim())) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    if (isEditing) {
      // --- LÓGICA DE EDICIÓN ---
      setEstudiantes((prevEstudiantes) =>
        prevEstudiantes.map((est) => 
          // Identificamos al estudiante por su documento original guardado
          est.documento === originalDocumento
            ? { ...formData } // Reemplazamos todos los datos con los nuevos
            : est
        )
      );

      // Desactivamos el modo edición y limpiamos el documento original
      setIsEditing(false);
      setOriginalDocumento(null);
      
    } else {
      // --- LÓGICA DE REGISTRO ---
      
      // Chequear si el documento ya existe (para evitar duplicados al registrar)
      if (estudiantes.some(est => est.documento === formData.documento)) {
          alert(`El documento ${formData.documento} ya se encuentra registrado.`);
          return;
      }
      
      const nuevoEstudiante = { ...formData };
      
      // Agrega el nuevo estudiante a la lista
      setEstudiantes((prevEstudiantes) => [...prevEstudiantes, nuevoEstudiante]);
    }

    // Limpia el formulario después de cualquier operación
    setFormData({
      documento: '',
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
    });
  };

  // Maneja la acción de Cancelar
  const handleCancel = () => {
    // Limpia el formulario
    setFormData({
      documento: '',
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
    });
    // Si estábamos editando, salimos del modo edición
    setIsEditing(false);
    setOriginalDocumento(null);
  };

  // -------------------------------------------------------------------
  // --- B. Manejo de la Lista (Editar y Eliminar) ---
  // -------------------------------------------------------------------

  // Nuevo: Carga los datos del estudiante en el formulario para su edición
  const handleEditar = (estudiante) => {
    // 1. Cargamos los datos del estudiante seleccionado en el formData
    setFormData(estudiante);

    // 2. Activamos el modo edición
    setIsEditing(true);

    // 3. Guardamos el documento original para saber a quién actualizar
    setOriginalDocumento(estudiante.documento);
    
    // Opcional: Deshabilitar el campo Documento si se está editando
    // (Esto se maneja en el JSX, no en la función)
  };

  // Maneja la acción de Eliminar un estudiante por su documento
  const handleEliminar = (documentoAEliminar) => {
    // Pregunta de confirmación
    if (!window.confirm(`¿Estás seguro de eliminar el estudiante con Documento: ${documentoAEliminar}?`)) {
        return;
    }
    
    // Filtra la lista para crear un nuevo array sin el estudiante a eliminar
    const nuevaLista = estudiantes.filter(
      (est) => est.documento !== documentoAEliminar
    );
    setEstudiantes(nuevaLista);
  };


  // -------------------------------------------------------------------
  // --- C. Renderizado (JSX) ---
  // -------------------------------------------------------------------

  return (
    <div style={styles.container}>
      
      {/* ----------------------------- Sección Izquierda: Formulario ----------------------------- */}
      <div style={styles.formSection}>
        <h2>Formulario</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Campo Documento: Deshabilitado si estamos editando */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Documento:</label>
            <input
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleInputChange}
              style={styles.input}
              required
              // Deshabilitar el documento si estamos editando para que no cambie la clave de identificación
              disabled={isEditing} 
            />
          </div>

          {/* Campos Nombre, Apellido, Teléfono, Correo */}
          {['nombre', 'apellido', 'telefono', 'correo'].map(field => (
            <div key={field} style={styles.formGroup}>
              <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                type={field === 'correo' ? 'email' : (field === 'telefono' ? 'tel' : 'text')}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
          ))}

          {/* Botones de acción */}
          <button type="submit" style={isEditing ? styles.saveButton : styles.registerButton}>
            {isEditing ? 'Guardar Cambios' : 'Registrar'} 
          </button>
        </form>
        <button type="button" onClick={handleCancel} style={styles.cancelButton}>
          Cancelar
        </button>
        {isEditing && (
            <p style={{textAlign: 'center', marginTop: '10px', color: '#007bff'}}>
                Modo Edición activado para el Documento **{originalDocumento}**.
            </p>
        )}
      </div>

      {/* ----------------------------- Sección Derecha: Lista de Estudiantes (Tabla) ----------------------------- */}
      <div style={styles.listSection}>
        <h2>Lista de estudiantes</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Documento</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Apellido</th>
              <th style={styles.th}>Correo</th>
              <th style={styles.th}>Teléfono</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((estudiante) => (
              <tr key={estudiante.documento}> 
                <td style={styles.td}>{estudiante.documento}</td>
                <td style={styles.td}>{estudiante.nombre}</td>
                <td style={styles.td}>{estudiante.apellido}</td>
                <td style={styles.td}>{estudiante.correo}</td>
                <td style={styles.td}>{estudiante.telefono}</td>
                <td style={styles.tdActions}>
                  <button
                    style={styles.editButton}
                    // Llamamos a la nueva función de edición
                    onClick={() => handleEditar(estudiante)}
                    disabled={isEditing} // No permitir editar otro si ya estamos en edición
                  >
                    Editar
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleEliminar(estudiante.documento)}
                    disabled={isEditing}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Mensaje cuando no hay datos */}
        {estudiantes.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
            No hay estudiantes registrados. Usa el formulario para agregar uno.
          </p>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// --- Estilos Básicos ---
// -------------------------------------------------------------------
const styles = {
  container: {
    display: 'flex',
    padding: '20px',
    gap: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  formSection: {
    flex: 1, 
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  listSection: {
    flex: 2, 
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  form: {
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  label: {
    minWidth: '100px',
    fontWeight: 'bold',
  },
  input: {
    flexGrow: 1,
    padding: '8px',
    marginLeft: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  registerButton: {
    backgroundColor: '#4CAF50', // Verde
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '10px',
  },
  saveButton: {
    backgroundColor: '#007bff', // Azul (para Guardar Cambios)
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '10px',
  },
  cancelButton: {
    backgroundColor: '#00bcd4', // Turquesa/Azul claro
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#066910ff',
  },
  td: {
    border: '1px solid #066910ff',
    padding: '8px',
    textAlign: 'left',
  },
  tdActions: {
    border: '1px solid #066910ff',
    padding: '8px',
    textAlign: 'center',
    whiteSpace: 'nowrap', 
  },
  editButton: {
    backgroundColor: '#007bff', 
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  deleteButton: {
    backgroundColor: '#dc3545', 
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default EstudiantesApp;