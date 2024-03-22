import { useFormik } from 'formik'
import React from 'react'
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {

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
            console.log('values: ', values);
            createUserWithEmailAndPassword(auth, values.email, values.password)
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
                <h3 className="t-center">Sign Up</h3>
                <input
                    type="email"
                    name="email"
                    placeholder='Email Address'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    autoComplete='off'
                />
                <input
                    type="password"
                    name="password"
                    placeholder='password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    autoComplete='off'
                />
                <button type='submit'>Submit</button>
                <button type='button' onClick={handleGoogleLogin}>Sign in with Google</button>
            </form>
            <p className="t-center">-------------------Already Account-------------------</p>
            <div className="bottom-btn">
                <button onClick={() => navigate("/login")}>Login</button>
            </div>

        </div>
    )
}

export default SignUp
