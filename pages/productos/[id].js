import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { FirebaseContext } from '../../firebase';
import styled from '@emotion/styled';
import Error404 from '../../components/Layout/404';
import Layout from '../../components/Layout/Layout';
import { css } from '@emotion/react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es} from 'date-fns/locale';
import {Campo, InputSubmit} from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`;
const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`

const Productos = () => {

      // state del componente
      const [producto, guardarProducto] = useState({});
      const [error, guardarError] = useState(false);
     /* const [comentario, guardarComentario ] = useState({});
      const [consultarDB, guardarConsultarDB ] = useState(true);*/


    //Routing id actual
    const router = useRouter();
    const {query: {id}} = router;
    // context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);
    
    useEffect(() => {
      
        if(id){
            const obtenerProducto = async () => {

                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if(producto.exists){
                    guardarProducto(producto.data());
                } else{
                    guardarError(true);
                }
            }            
            obtenerProducto();
        }        
    }, [id])

    if(Object.keys(producto).length === 0 && !error)  return 'Cargando...';
    
    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;

    return ( 
        <Layout>
            <>
            {error && <Error404/>}
            <div className="contenedor">
                        <h1 css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}>{nombre}</h1>


            <ContenedorProducto>
                <div>
                    <p>Publicado hace: { formatDistanceToNow( new Date(creado), {locale: es} )} </p>
                    <p>Por: {creador.nombre} de {empresa} </p>
                    <img src={urlimagen}/>                    
                    <p>{descripcion}</p>

                   {usuario && (
                       <>
                        <h2>Agrega tu comentario</h2>
                        <form>
                            <Campo>
                                <input 
                                type="text" 
                                name="mensaje"/>
                            </Campo>
                            <InputSubmit
                                type="submit"
                                value="Agregar Comentario"
                            />
                        </form>
                        </>
                   )}
                    <h2 css={css`margin: 2rem 0;`}>Comentarios</h2>
                        {comentarios.map(comentario => (
                            <ul>

                            <li>
                                <p>{comentario.nombre}</p>
                                <p>Escrito por: {comentario.usuarioNombre}</p>
                            </li>
                            </ul>

                        ))}
                </div>
                <aside>
                    <Boton
                       target="_blank"
                       bgColor="true"
                       href={url}                    
                    >Visitar URL</Boton>
                    <p>{votos} votos</p>
                    
                    {usuario && (
                       <Boton>Votar</Boton>
                    )}
                </aside>
            </ContenedorProducto>
            </div>
            </>
        </Layout>
     );
}
 
export default Productos;