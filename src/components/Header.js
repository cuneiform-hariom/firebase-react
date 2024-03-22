import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';


const Header = () => {

    const [loggedin, setLoggedin] = useState(false)
    const [userInfo, setUserInfo] = useState()

    const navigate = useNavigate()

    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserInfo(user)
                setLoggedin(true)
            } else {
                setLoggedin(false)
            }
        })
    }, [auth])

    const handleSignOut = () => {
        signOut(auth)
            .then(() => navigate("/"))
            .catch(err => console.log(err))
    }

    return (
        <div className='header'>
            {
                loggedin ?
                    <div className='navmenu'>
                        <span>{userInfo?.displayName || userInfo?.email}</span>
                        <button onClick={handleSignOut}>LogOut</button>
                        <Link to="/adduser">Add Users</Link>
                        <Link to="/allusers">All Users</Link>
                    </div> :
                    <div className='navmenu'>
                        <button onClick={() => navigate("/login")}>Log In</button>
                        <button onClick={() => navigate("/signup")}>Sign Up</button>
                    </div>
            }

        </div >
    )
}

export default Header
