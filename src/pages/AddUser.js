import { useFormik } from 'formik';
import React from 'react'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { app } from '../firebase';
import * as yup from 'yup'

const AddUser = () => {

    const db = getFirestore(app)

    const initialValues = {
        name: "",
        email: "",
        phone: "",
    }

    const validationSchema = yup.object({
        name: yup.string().required("Name is required"),
        email: yup.string()
            .email('Email must be valid')
            .required("Email is required"),
        phone: yup.number()
            .typeError("Phone number must be a number")
            .positive("Phone number can not be negative or zero")
            .integer("Phone number must be an integer")
            .required("Phone is required")
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const docRef = await addDoc(collection(db, "users"), values);
                console.log('docRef: ', docRef);
            } catch (error) {
                console.log('error: ', error);
            }
        }
    })
    return (
        <div>
            <div className='signup-page'>
                <form onSubmit={formik.handleSubmit}>
                    <h3 className="t-center">Add User</h3>
                    <div className='form-field'>
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            placeholder='Name'
                        />
                        {formik.errors.email && formik.touched.name ? (<span className="err">{formik.errors.name}</span>) : null}
                    </div>
                    <div className='form-field'>
                        <input
                            type="email"
                            name="email"
                            placeholder='Email Address'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.email && formik.touched.email ? (<span className="err">{formik.errors.email}</span>) : null}
                    </div>
                    <div className='form-field'>
                        <input
                            type="tel"
                            name="phone"
                            placeholder='Phone'
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.email && formik.touched.phone ? (<span className="err">{formik.errors.phone}</span>) : null}
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddUser
