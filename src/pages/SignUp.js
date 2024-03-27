import { useFormik } from 'formik'
import React from 'react'
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, sendEmailVerification } from "firebase/auth";
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const navigate = useNavigate()

    const initialValues = {
        name: "",
        phone: "",
        email: "",
        password: ""
    }
    const formik = useFormik({
        initialValues,
        onSubmit: async (values) => {
            console.log('values: ', values);
            await createUserWithEmailAndPassword(auth, values.email, values.password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    return updateProfile(user, { displayName: values.name, phoneNumber: values.phone })
                        .then(() => {
                            console.log('user: ', user);
                            sendEmailVerification(user).catch((error) => alert(error.message));
                        })
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("Error : ", errorCode, errorMessage);
                });
        },
    });


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
                    type="text"
                    name="name"
                    placeholder='Name'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    autoComplete='off'
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder='Phone'
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    autoComplete='off'
                />
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
