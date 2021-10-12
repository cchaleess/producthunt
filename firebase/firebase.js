import app from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore';

class Firebase {

    firebaseConfig = {
        apiKey: "AIzaSyDoVhZ3DwC37fF04eKnQqZrb70ba3QUXVg",
        authDomain: "product-hunt-431a4.firebaseapp.com",
        projectId: "product-hunt-431a4",
        storageBucket: "product-hunt-431a4.appspot.com",
        messagingSenderId: "792053682524",
        appId: "1:792053682524:web:6c989557dda56901243199"
      };

    constructor(){

        if(!app.apps.length) {
            app.initializeApp(this.firebaseConfig)
        }

        this.auth = app.auth();
        this.db = app.firestore();
        this.storage = app.storage();

    }

    //Registrar usuario
    async registrar(nombre,email,password){

        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email, password);
        return nuevoUsuario.user.updateProfile({displayName : nombre})
    }
    

    //INicia sesion del usuario
    async login(email, password){   
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    //Cierra sesion de usuario
    async cerrarSesion(){
        await this.auth.signOut();
    }
 }   
 const firebase = new Firebase();

export default firebase;