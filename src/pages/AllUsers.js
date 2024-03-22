import React, { useEffect, useState } from 'react';
import { getFirestore, collection, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

const AllUsers = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    console.log('users: ', users);
    const db = getFirestore(app);

    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let usersArray = [];
            querySnapshot.forEach((doc) => {
                usersArray.push({ ...doc.data(), id: doc.id });
            });
            setUsers(usersArray);
        });
        return () => unsub();
    }, [db]);

    const handleDelete = async (id) => {
        const res = await deleteDoc(doc(db, "users", id));
        console.log('res: ', res);
    }

    return (
        <div>
            <h1>All Users</h1>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Phone</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        users && users.map((ele, index) =>
                            <tr key={index}>
                                <td>{ele.name}</td>
                                <td>{ele.email}</td>
                                <td>{ele.phone}</td>
                                <td>
                                    <button onClick={() => navigate(`/allusers/${ele.id}`)}>Edit</button>
                                    <button onClick={() => handleDelete(ele.id)}>Delete</button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>

        </div>
    );
};

export default AllUsers;
