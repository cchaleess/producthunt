import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import {FirebaseContext} from '../firebase';
//validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';
import Error404 from '../components/Layout/404';

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  //imagen: '',
  url: '',
  descripcion: ''
}

const NuevoProducto = () => {

  //state imagenes
  const [nombreimagen, guardarNombre] = useState('');
  const [subiendo, guardarSubiendo] = useState(false);
  const [progreso, guardarProgreso] = useState(0);
  const [urlimagen, guardarUrlImagen] = useState('');

  const [error, guardarError] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion
  (STATE_INICIAL,validarCrearProducto, crearProducto);

  const {nombre, empresa, imagen, url, descripcion} = valores;
  //Hook redireccionamiento
  const router = useRouter();

  //Context con el CRUD de firebase
  const {usuario, firebase} = useContext(FirebaseContext)
  //console.log(usuario);
  async function crearProducto(){
   
    if (!usuario) {
      return router.push('/login')
    }

    //Crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios : [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    }

    // insertarlo en la base de datos
    firebase.db.collection('productos').add(producto);
   return router.push('/');
  }

   const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true)
    }

    const handleProgress = progreso => guardarProgreso({ progreso });

    const handleUploadError = error => {
      guardarSubiendo(error);        
      console.error(error);
    };

  const handleUploadSuccess = nombre => {

  guardarProgreso(100);
  guardarSubiendo(false);
  guardarNombre(nombre);      
  guardarUrlImagen(url);        
  firebase
          .storage
          .ref("productos")
          .child(nombre)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            guardarUrlImagen(url);
          } );
  };

  return ( 
    <div>
    <Layout>
      {!usuario ? <Error404/> : (

        <>
        <h1 css={css`text-align: center; margin-top: 5rem;`}>Nuevo Producto</h1>
        
        <Formulario onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>Información general</legend>
            <Campo>
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" placeholder="Nombre del producto" name="nombre" 
                  value= {nombre} onChange={handleChange} onBlur={handleBlur} />
            </Campo>
            {errores.nombre &&  <Error>{errores.nombre}</Error>}

            <Campo>
                <label htmlFor="empresa">Empresa</label>
                <input type="text" id="empresa" placeholder="Empresa o compañia" name="empresa" 
                 value= {empresa} onChange={handleChange} onBlur={handleBlur} />
              </Campo>
            {errores.empresa &&  <Error>{errores.empresa}</Error>}

            <Campo>
                <label htmlFor="imagen">Imagen</label>
                <FileUploader 
                    accept = "image/*"
                    id="imagen" 
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                    />
              </Campo>
              <Campo>
                  <label htmlFor="url">Url</label>
                  <input type="url" id="url" name="url" 
                   value= {url} onChange={handleChange} onBlur={handleBlur} placeholder="URL de tu producto" />
              </Campo>
              
              {errores.url &&  <Error>{errores.url}</Error>}
              </fieldset>

              <fieldset>
                 <legend>Sobre tu producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea id="descripcion" name="descripcion" placeholder="Describe el producto"
                        value= {descripcion} onChange={handleChange} onBlur={handleBlur} />
                </Campo>
                
                {errores.descripcion &&  <Error>{errores.descripcion}</Error>}
             </fieldset>
         
          <InputSubmit type="submit" value="agregar producto" />
        </Formulario>
        </>

              )
              
              }
              
            </Layout>
            </div>   
          );
}
export default NuevoProducto
