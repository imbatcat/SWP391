import { useEffect, } from 'react';
import { nanoid } from 'nanoid';

import './App.css';
async function fetchData(setData) {
    try {
        const response = await fetch('https://localhost:7206/api/Accounts', {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            credentials: 'include',
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
            // body data type must match "Content-Type" header
        });
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        const json = await response.json();
        setData(json); // Ensure setData is correctly referenced
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}

async function login() {
    try {
        const response = await fetch('https://localhost:7206/api/ApplicationAuth/login', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(
                {
                    "userName": "string",
                    "password": "Dat.11",
                    "rememberMe": true
                }
            ) // body data type must match "Content-Type" header
        });
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        //const json = await response.json();
        //setToken(json); // Ensure setData is correctly referenced
        console.log('ok');
    } catch (error) {
        console.error(error.message);
    }
}
async function logout() {
    try {
        const response = await fetch('https://localhost:7206/api/ApplicationAuth/logout', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.

            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        console.log('ok');
    } catch (error) {
        console.error(error.message);
    }
}
async function signup(id) {
    try {
        /*        var now = new Date();*/
        console.log('rutkre' + id);
        const response = await fetch('https://localhost:7206/api/ApplicationAuth/register', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "fullName": "Phan Tuan Dat",
                "email": "da1@example.com",
                "userName": "ruxt1re",
                "password": "Dat.11",
                "isMale": true,
                "roleId": 1,
                "phoneNumber": "0934661790",
                "dateOfBirth": "2004-06-01"
            })
        });
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        console.log('ok');
    } catch (error) {
        console.error(error.message);
    }
}
function App() {
    //const [data, setData] = useState([]);
    //const [token, setToken] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        fetch("https://localhost:7206/api/vn-pay-api-management/payment-callback", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            credentials: 'include',
            body: params.toString()
        }).then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
        console.log(params);
    }, []);

    const id = nanoid(2);
    return (
        <><div>
            <button onClick={() => fetchData()}>Fetch data</button>
            <button onClick={() => signup(id)}>signup</button>
            <button onClick={() => login()}>login</button>
            <button onClick={() => logout()}>logout</button>
        </div><div>
                Hello world
            </div></>
    );
}

export default App;