import React, { useState, useEffect } from 'react';

const INE = () => {
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
  });
  const [estudiantes, setEstudiantes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:3000/api/estudiantes';

  // Cargar estudiantes al iniciar
  useEffect(() => {
    cargarEstudiantes();
  }, []);

  // Función para cargar estudiantes
  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      console.log('Cargando estudiantes desde:', API_URL);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Estudiantes cargados:', data);
      setEstudiantes(data);
    } catch (err) {
      console.error('Error cargando estudiantes:', err);
      setError('Error al cargar estudiantes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Crear o actualizar estudiante
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación
    if (Object.values(formData).some(value => !value.trim())) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);

    try {
      let response;
      
      if (isEditing) {
        // ACTUALIZAR
        console.log('Actualizando estudiante ID:', editingId, 'Datos:', formData);
        response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // CREAR
        console.log('Creando nuevo estudiante:', formData);
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      const result = await response.json();
      console.log('Respuesta del servidor:', result);

      if (!response.ok) {
        throw new Error(result.mensaje || 'Error en la operación');
      }

      // Recargar lista y limpiar formulario
      await cargarEstudiantes();
      handleCancel();

    } catch (err) {
      console.error('Error en handleSubmit:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setFormData({
      documento: '',
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
    });
    setIsEditing(false);
    setEditingId(null);
    setError('');
  };

  // Editar estudiante
  const handleEditar = (estudiante) => {
    console.log('Editando estudiante:', estudiante);
    setFormData({
      documento: estudiante.documento,
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      telefono: estudiante.telefono,
      correo: estudiante.correo,
    });
    setIsEditing(true);
    setEditingId(estudiante.id);
    setError('');
  };

  // Eliminar estudiante
  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      return;
    }

    try {
      console.log('Eliminando estudiante ID:', id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('Respuesta eliminación:', result);

      if (!response.ok) {
        throw new Error(result.mensaje || 'Error al eliminar');
      }

      await cargarEstudiantes();
    } catch (err) {
      console.error('Error eliminando:', err);
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formSection}>
        <h2>Formulario</h2>
        
        {error && (
          <div style={styles.errorMessage}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Documento:</label>
            <input
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleInputChange}
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          {['nombre', 'apellido', 'telefono', 'correo'].map(field => (
            <div key={field} style={styles.formGroup}>
              <label style={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </label>
              <input
                type={field === 'correo' ? 'email' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                style={styles.input}
                required
                disabled={loading}
              />
            </div>
          ))}

          <button 
            type="submit" 
            style={isEditing ? styles.saveButton : styles.registerButton}
            disabled={loading}
          >
            {loading ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Registrar')}
          </button>
        </form>

        <button 
          type="button" 
          onClick={handleCancel}
          style={styles.cancelButton}
          disabled={loading}
        >
          Cancelar
        </button>

      </div>

      <div style={styles.listSection}>
        <h2>Lista de Estudiantes</h2>
        

        {loading && estudiantes.length === 0 ? (
          <p style={styles.loading}>Cargando estudiantes...</p>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Documento</th>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Apellido</th>
                  <th style={styles.th}>Teléfono</th>
                  <th style={styles.th}>Correo</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map(estudiante => (
                  <tr key={estudiante.id}>

                    <td style={styles.td}>{estudiante.documento}</td>
                    <td style={styles.td}>{estudiante.nombre}</td>
                    <td style={styles.td}>{estudiante.apellido}</td>
                    <td style={styles.td}>{estudiante.telefono}</td>
                    <td style={styles.td}>{estudiante.correo}</td>
                    <td style={styles.tdActions}>
                      <button
                        style={styles.editButton}
                        onClick={() => handleEditar(estudiante)}
                        disabled={loading || isEditing}
                      >
                        Editar
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleEliminar(estudiante.id, estudiante.nombre)}
                        disabled={loading}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                    <button 
          onClick={cargarEstudiantes} 
          style={styles.refreshButton}
          disabled={loading}
        >
           Actualizar Lista
        </button>

            {estudiantes.length === 0 && !loading && (
              <p style={styles.noData}>No hay estudiantes registrados</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Estilos (igual que antes)
const styles = {
  container: { display: 'flex', padding: '20px', gap: '20px', fontFamily: 'Arial, sans-serif' },
  formSection: { flex: 1, padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
  listSection: { flex: 2, padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
  form: { marginBottom: '20px' },
  formGroup: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  label: { minWidth: '100px', fontWeight: 'bold' },
  input: { flexGrow: 1, padding: '8px', marginLeft: '10px', border: '1px solid #ccc', borderRadius: '4px' },
  registerButton: { backgroundColor: '#4CAF50', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  saveButton: { backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  cancelButton: { backgroundColor: '#6c757d', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' },
  refreshButton: { backgroundColor: '#17a2b8', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#066910', color: 'white' },
  td: { border: '1px solid #ddd', padding: '8px' },
  tdActions: { border: '1px solid #ddd', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' },
  editButton: { backgroundColor: '#007bff', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  deleteButton: { backgroundColor: '#dc3545', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  errorMessage: { backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #f5c6cb' },
  editingInfo: { textAlign: 'center', marginTop: '10px', color: '#007bff', fontStyle: 'italic' },
  loading: { textAlign: 'center', color: '#666' },
  noData: { textAlign: 'center', color: '#888', marginTop: '20px' }
};

export default INE;