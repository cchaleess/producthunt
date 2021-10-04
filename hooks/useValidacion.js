import React, {useState, useEffect} from 'react'

const useValidacion = (stateInicial, validar, fn) => {

    const [valores, setValores] = useState(stateInicial);
    const [errores, setErrores] = useState({})
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
       
        if(submitForm){
            const noErrores = Object.keys(errores).length === 0; //verifico Objeto vacio o no

            if(noErrores){
                fn(); //funcion que se ejecuta en el componente
            }

            setSubmitForm(false);
        }
        
    }, [errores, fn, submitForm]);

    //Funcion que se ejecuta cuando el usuario escribe

    const handleChange = e => {
        setValores({
            ...valores,
            [e.target.name] : e.target.value
        })
    }

    //Funcion que se ejecuta cuando el usuario hace submit

    const handleSubmit = e => {
        e.preventDefault();
        setSubmitForm(true);
    }

    //Cuando se realiza evento Blur

    const handleBlur = e => {

        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
    }

    return {
        valores,
        errores,
        handleSubmit,
        handleChange,
        handleBlur
    }
}
export default useValidacion;