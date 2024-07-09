import {
    MDBBtn,
    MDBCol,
    MDBInput,
    MDBRadio,
    MDBRow
} from 'mdb-react-ui-kit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function CreateModalForm() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState();
    const navigate = useNavigate();

    const handleFirstNameChange = (e) => setFirstname(e.target.value);
    const handleLastNameChange = (e) => setLastname(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handlePhonenumberChange = (e) => setPhonenumber(e.target.value);
    const handleBirthdayChange = (e) => setDateOfBirth(e.target.value);
    const handleGenderChange = (e) => {
        e.target.value === 'Male' ? setGender(true) : setGender(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!firstname || !lastname || !username || !phonenumber || !email || !dateOfBirth || !password || gender === undefined) {
            toast.error('Please fill in all required fields.');
            return;
        }
        register();
    };

    async function register() {
        try {
            const response = await fetch('https://localhost:7206/api/ApplicationAuth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    "userName": username,
                    "password": password,
                    "fullName": `${lastname} ${firstname}`,
                    "email": email,
                    "phoneNumber": phonenumber,
                    "isMale": gender,
                    "roleId": '1',
                    "dateOfBirth": dateOfBirth
                })
            });
            if (!response.ok) {
                throw new Error('Error registering user');
            }
            console.log('Registration successful');
            navigate('/admin/vets');
        } catch (error) {
            toast.error('Registration failed!');
            console.error(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <MDBRow>
                <MDBCol md='6'>
                    <MDBInput
                        wrapperClass='mb-4'
                        label='First Name'
                        size='lg'
                        id='form1'
                        type='text'
                        required
                        onChange={handleFirstNameChange}
                    />
                </MDBCol>
                <MDBCol md='6'>
                    <MDBInput
                        wrapperClass='mb-4'
                        label='Last Name'
                        size='lg'
                        id='form2'
                        type='text'
                        required
                        onChange={handleLastNameChange}
                    />
                </MDBCol>
            </MDBRow>

            <MDBRow className='mb-4'>
                <MDBCol md='12'>
                    <MDBInput
                        wrapperClass='mb-4'
                        label='Username'
                        size='lg'
                        id='form3'
                        type='text'
                        required
                        onChange={handleUsernameChange}
                    />
                </MDBCol>
                <MDBRow>
                    <MDBCol md='12'>
                        <MDBInput
                            wrapperClass='mb-4'
                            label='Password'
                            size='lg'
                            id='form4'
                            type='password'
                            required
                            onChange={handlePasswordChange}
                        />
                    </MDBCol>
                </MDBRow>
                <MDBCol md='6'>
                    <MDBInput
                        wrapperClass='mb-2'
                        label='Birthday'
                        size='lg'
                        id='form5'
                        type='date'
                        required
                        onChange={handleBirthdayChange}
                    />
                </MDBCol>
                <MDBCol md='6'>
                    <h6 className="fw-bold">Gender: </h6>
                    <MDBRadio
                        name='inlineRadio'
                        id='inlineRadio1'
                        value='Female'
                        label='Female'
                        inline
                        onChange={handleGenderChange}
                    />
                    <MDBRadio
                        name='inlineRadio'
                        id='inlineRadio2'
                        value='Male'
                        label='Male'
                        inline
                        onChange={handleGenderChange}
                    />
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol md='6'>
                    <MDBInput
                        wrapperClass='mb-4'
                        label='Email'
                        size='lg'
                        id='form6'
                        type='email'
                        required
                        onChange={handleEmailChange}
                    />
                </MDBCol>
                <MDBCol md='6'>
                    <MDBInput
                        wrapperClass='mb-4'
                        label='Phone Number'
                        size='lg'
                        id='form7'
                        type='tel'
                        required
                        onChange={handlePhonenumberChange}
                    />
                </MDBCol>
            </MDBRow>
            <MDBBtn type='submit' className='mb-4' color='danger' size='lg'>Submit</MDBBtn>
        </form>
    );
}

export default CreateModalForm;
