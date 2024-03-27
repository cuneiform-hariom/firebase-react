import { useFormik } from 'formik';
import React, { useState } from 'react'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { app } from '../firebase';
import * as yup from 'yup'
import { toast } from 'react-toastify';
import pimage from '../assets/profile.webp'
import { getStorage, ref, uploadBytes } from "firebase/storage";


const AddUser = () => {
    const [profileImage, setProfileImage] = useState(pimage)

    const db = getFirestore(app)

    const storage = getStorage(app)

    const initialValues = {
        name: "",
        email: "",
        phone: "",
        profileImg: null
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
            .required("Phone is required"),
        profileImg: yup.mixed()
            .required("Image is required")
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log('values: ', values);
            const p_img = ref(storage, `uploads/images/${Date.now() + "-" + values.profileImg.name}`)
            const uploadedImage = await uploadBytes(p_img, values.profileImg)
            console.log('uploadedImage: ', uploadedImage.ref.fullPath);
            const data = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                profileImage: uploadedImage.ref.fullPath,
            }
            try {
                await addDoc(collection(db, "users"), data);
                toast.success("User added successfully!")
                resetForm()
            } catch (error) {
                console.log('error: ', error);
            }
        }
    })

    const handleImageChange = async (event) => {
        const selectedFile = event.target.files[0];
        formik.setFieldValue("profileImg", selectedFile);
        setProfileImage(URL.createObjectURL(selectedFile));
    };

    return (
        <div>
            <div className='signup-page'>
                <form onSubmit={formik.handleSubmit}>
                    <h3 className="t-center">Add User</h3>
                    <div className="imgPrev" style={{ backgroundImage: `url(${profileImage})` }}>
                        <label htmlFor="image"></label>
                        <input
                            type="file"
                            name="image"
                            id="image"
                            className='d-none'
                            onChange={handleImageChange}
                            onBlur={formik.handleBlur}
                            accept='.jpg'
                        />
                    </div>
                    {formik.touched.image && formik.errors.image && <span className='text-danger'>{formik.errors.image}</span>}
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
