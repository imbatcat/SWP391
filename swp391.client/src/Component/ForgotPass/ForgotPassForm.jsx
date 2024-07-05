import {
    MDBBtn,
    MDBInput,
} from 'mdb-react-ui-kit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



function ForgotPassForm() {
    const [email, setEmail] = useState('');
    const handleOnChange = (e) => {
        setEmail(e.target.value);
    };
    var navigate = useNavigate();
    const SendResetPassword = async () => {
        const fetchPromise = fetch(`https://localhost:7206/api/auth/send-reset-password-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials if needed
            body: JSON.stringify({ email })
        });

        toast.promise(
            fetchPromise,
            {
                pending: 'Sending reset password email...',
                success: 'Check your emails',
                error: 'Something went wrong'
            }
        );

        try {
            const response = await fetchPromise;
            if (response.ok) {
                navigate('');
            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.log("Something went wrong");
        }
    };
    return (
        <form >
            <p><MDBInput id='ownerEmail' label='Your Email' onChange={(e) => handleOnChange(e)} /></p>

            <MDBBtn type='submit' onClick={(e) => { e.preventDefault(); SendResetPassword(email, navigate); }} outline color='dark' block>
                Send Recovery Email
            </MDBBtn>
        </form>
    );
}

export default ForgotPassForm;