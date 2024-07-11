
import Hero from '../../Component/Hero/Hero';
import MainLayout from '../../Layouts/MainLayout';
import HomeContent from '../../Component/Home Content/HomeContent';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
function Home() {
    const [params, setParams] = useState(new URLSearchParams(window.location.search));
    useEffect(() => {
        const callback = async () => {
            const response = await fetch("https://localhost:7206/api/vn-pay-api-management/payment-callback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                credentials: 'include',
                body: params.toString()
            });
            const data = await response.json();
            if (data && response.status === 200) toast.success('Your appointment has been successfully booked!');
            else throw new Error()
        };

        if (params != null) {
            toast.promise(
                callback(),
                {
                    pending: 'Registering your appointment...',
                    success: 'Appointment registered!',
                }
            )
        }
    }, [params]);
    return (
        <div>
            <MainLayout>
                <Hero></Hero>
                <HomeContent />
            </MainLayout>
        </div>
    );
}

export default Home;