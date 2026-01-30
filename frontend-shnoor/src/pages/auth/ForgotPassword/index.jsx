import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../auth/firebase';
import ForgotPasswordView from './view';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('If an account exists with this email, a reset link has been sent.');
        } catch (err) {
            console.error("Reset Password Error:", err);
            // Optional: Handle specific Firebase error codes if needed
            if (err.code === 'auth/user-not-found') {
                 // For security, usually we don't tell the user the email doesn't exist, 
                 // but you can change this if you want.
                 setMessage('If an account exists with this email, a reset link has been sent.');
            } else {
                 setError("Failed to reset password. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ForgotPasswordView
            email={email}
            setEmail={setEmail}
            message={message}
            error={error}
            loading={loading}
            handleReset={handleReset}
        />
    );
};

export default ForgotPassword;