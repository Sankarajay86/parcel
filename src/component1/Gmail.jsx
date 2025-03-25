import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebaseconfig'; // Make sure firebaseconfig is set up correctly
import Page from './Page'; // Your Page component
import './Gmail.css';
import { FaGoogle } from 'react-icons/fa'; 
import img from '../img/gpslogo.png'


function Gmail() {
    const [user, setUser] = useState(null); // State to store user data
  
    // Handle Google sign-in
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setUser(user); // Set the signed-in user
        } catch (error) {
            console.error('Error signing in: ', error.message);
        }
    };

    return (
        <>
            <div className="App">
                {user ? (
                    <div>
                        {/* <h2>Hello, {user.displayName}!</h2>
                        
                        <p>Creation Time: {new Date(user.metadata.creationTime).toLocaleString()}</p> */}
                        <Page displayName={user.email} />
                        {/* <p>Email: {user.email}</p>  */}
                    </div>
                ) : (
                    
                    <div className='maran'>
                        <img src={img} alt="" style={{ marginRight: '10px' }} className='imgs'/>
                        <p> Parcel service</p>
                        <p className='mar'>Sign in to continue</p>
                        <button onClick={handleGoogleSignIn} className='gg' >
                        <FaGoogle style={{ marginRight: '10px' }} /> {/* Google logo */}
                        Sign in with Google
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Gmail;
