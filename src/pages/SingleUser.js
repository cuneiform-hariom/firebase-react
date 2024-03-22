/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from '../firebase';
import { useFormik } from 'formik';


const SingleUser = () => {
    const params = useParams()
    const db = getFirestore(app)

    useEffect(() => {
        async function fetchData() {
            const docRef = doc(db, "users", params.id);
            const userData = (await getDoc(docRef)).data();
            console.log('userData: ', userData);
            formik.setValues({
                name: userData?.name,
                email: userData?.email,
                phone: userData?.phone,
            })
        }
        fetchData();
    }, [params, db])

    const initialValues = {
        name: "",
        email: "",
        phone: "",
    }

    const formik = useFormik({
        initialValues,
        onSubmit: async (values) => {
            await setDoc(doc(db, "users", params.id), {
                name: values.name,
                email: values.email,
                phone: values.phone
            })
        }
    })


    return (
        <div>
            <div className='signup-page'>
                <form onSubmit={formik.handleSubmit}>
                    <h3 className="t-center">Update User</h3>
                    <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        placeholder='Name'
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder='Email Address'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder='Phone'
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                    />
                    <button type='submit'>Update</button>
                </form>
            </div>
        </div>
    )
}

export default SingleUser
