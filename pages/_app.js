import App from 'next/app'
import firebase from "../firebase";
import useAutenticacion from "../hooks/useAutenticacion";
import FirebaseContext from '../firebase/context';
const MyApp = props => {

  const usuario = useAutenticacion();
  const { Component, pageProps } = props;

  return (
    <FirebaseContext.Provider value={{ firebase, usuario }}>
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
};

export default MyApp;
