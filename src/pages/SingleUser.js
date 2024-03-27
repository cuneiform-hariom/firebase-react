/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from '../firebase';
import { useFormik } from 'formik';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';


const SingleUser = () => {
    const [user, setUser] = useState()
    const [profileImage, setProfileImage] = useState()
    const params = useParams()
    const db = getFirestore(app)
    const storage = getStorage(app)

    useEffect(() => {
        if (user?.profileImage) {
            getDownloadURL(ref(storage, user?.profileImage))
                .then((url) => {
                    setProfileImage(url)
                })
                .catch((error) => {
                    console.log('error: ', error);
                });
        }
    }, [user])

    useEffect(() => {
        async function fetchData() {
            const docRef = doc(db, "users", params.id);
            const userData = (await getDoc(docRef)).data();
            setUser(userData)
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
        profileImg: null
    }

    const formik = useFormik({
        initialValues,
        onSubmit: async (values) => {
            const p_img = ref(storage, `uploads/images/${Date.now() + "-" + values.profileImg.name}`)
            const uploadedImage = await uploadBytes(p_img, values.profileImg)
            const data = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                profileImage: uploadedImage.ref.fullPath,
            }
            await setDoc(doc(db, "users", params.id), data)
            toast.success("Profile Updated Successfully")
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
                    <h3 className="t-center">Update User</h3>
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
