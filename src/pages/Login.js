import { useFormik } from 'formik'
import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';


const Login = () => {

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const navigate = useNavigate()

    const initialValues = {
        email: "",
        password: ""
    }

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            signInWithEmailAndPassword(auth, values.email, values.password)
                .then(user => console.log(user))
                .catch((error) => console.log("error: ", error));
        }
    })

    const handleGoogleLogin = () => {
        signInWithPopup(auth, provider)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        <div className='signup-page'>
            <form onSubmit={formik.handleSubmit}>
                <h3 className="t-center">Login</h3>
                <input
                    type="email"
                    name="email"
                    placeholder='Email Address'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder='password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                />
                <button type='submit'>Submit</button>
                <button type='button' onClick={handleGoogleLogin}>Sign in with Google</button>
            </form>
            <p className="t-center">-------------------No Account-------------------</p>
            <div className="bottom-btn">
                <button onClick={() => navigate("/signup")}>Sign Up</button>
            </div>
        </div>
    )
}

export default Login
