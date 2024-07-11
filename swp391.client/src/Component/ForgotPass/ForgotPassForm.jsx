import {
    MDBBtn,
    MDBInput,
} from 'mdb-react-ui-kit';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ForgotPassForm() {
    const [email, setEmail] = useState('');
    const [buffer, setBuffer] = useState([]);
    const [isSending, setIsSending] = useState(false);
    var navigate = useNavigate();

    const handleOnChange = (e) => {
        setEmail(e.target.value);
    };

    const SendResetPassword = async () => {
        if (isSending) {
            setBuffer((prevBuffer) => [...prevBuffer, email]);
            return;
        }

        setIsSending(true);

        const sendResetPasswordEmail = async () => {
            var response = await fetch(`https://localhost:7206/api/auth/send-reset-password-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            })
            if (response.status !== 200) throw new Error("Invalid email"); 
        };
        toast.promise(
            sendResetPasswordEmail().catch(err => {
                console.error(err);
                throw new err
            }),
            {
                pending: 'Sending reset password email...',
                success: 'Email sent successfully!',
                error: 'Failed to send email!'
            }
        ).finally(() => {
            setIsSending(false); 
        });
    };

    return (
        <form>
            <p><MDBInput id='ownerEmail' label='Your Email' onChange={(e) => handleOnChange(e)} /></p>
            <MDBBtn type='submit' onClick={(e) => { e.preventDefault(); SendResetPassword(); }} outline color='dark' block>
                Send Recovery Email
            </MDBBtn>
        </form>
    );
}

export default ForgotPassForm;
