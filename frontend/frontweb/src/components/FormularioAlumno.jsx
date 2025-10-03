import { useState } from "react";
//import propTypes from propTypes;

const FormularioAlumno =({agregarAlumno}) => {
    const[nombre,setNombre ] = useState("");
    const[email,setEmail ] = useState("");
    const[curso,setCurso ] = useState("");
    const[sexo,setSexo ] = useState("Masculino");
    const[HablaIngles,setHablaIngles] = useState(false);

    const handleChangeSexo = (e) =>
    {
     setSexo(e.target.Value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        agregarAlumno({
         nombre_alumno: nombre,
         email_alumno: email,
         curso_aluno: curso,
         sexo_alumno: sexo,
         hablaingles: hablaingles,
        });
        
        setNombre("");
        setEmail("");
        setCurso("");
        setSexo("masculino");
        setHablaIngles(false);
    };
 return(
    <form onSubmit={handleSubmit}>
       <div className="mb-3">
            <label className="form-label">Nombre del Alumno</label>
              <input
                type="text"
                name="nombre_alumno"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
        </div>
       <div className="mb-3">
            <label className="form-label">Email del Alumno</label>
              <input
                type="text"
                name="email_alumno"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
       <div className="mb-3">
            <label className="form-label">Selecione un Curso</label>
                <select
                   name="curso_alumno"
                   className="form-control"
                   value={curso}
                   onChange={(e) =>  setCurso(e.target.value)}
                   required>
                   <option value="">SELECCIONE EL CURSO</option>
                   <option value="ReactJS">ReactJS</option>
                   <option value="Python">Python</option>
                   <option value="NodeJS">NodeJS</option>   
                </select> 

        </div>
       <div className="mb-3">
            <label className="form-label">Sexo del Alumno</label>
            <div className="form-check">
              <input
                 className="form-control"
                 type="radio"
                 name="sexo_alumno"
                 id="Masculino"    
                 value="Masculino"         
                 checked ={sexo === "Masculino"}
                 onChange={handleChangeSexo}
                 required
               />
            </div>
            <label className="form-check-label" htmlFor="masculino">
                Masculino
            </label>
               <div className="form-check">
              <input
                 className="form-control"
                 type="radio"
                 name="sexo_alumno"
                 id="Femenino"    
                 value="Femenino"         
                 checked ={sexo === "Femenino"}
                 onChange={handleChangeSexo}
                 required
               />
            </div>
            <label className="form-check-label" htmlFor="Femenino">
                Femenino
            </label>
        </div>
        <div className="mb-3">
            <label className="form-label">Habla Ingles</label>
              <div className="form-check form-switch">
                <input
                  name="habla_ingles"
                  className="form-check-input"
                  type="checkbox"
                  id="ingles"
                  checked={HablaIngles}
                  onChange={(e) => setHablaIngles(e.target.checked)}
                />
              </div>
              <label className="form-check-label" htmlFor="ingles">
                {HablaIngles ? "Yes/Si" : "No/No"}
              </label>
        </div>
        <div className="d-grid gap-2 mb-5">
            <button type="submit" className="btn btn-primary block btn_add">
                Registar Nuevo Alumno
            </button>
        </div>
    </form>
);
};
export default FormularioAlumno;
/*FormularioAlumno.proptypes = {
agregarAlumno: propTypes.func.isRequired,
};*/



