import { useState, useEffect } from 'react';
import {
    MDBBadge, MDBBtn, MDBTable, MDBTableBody, MDBTableHead,
    MDBAccordion, MDBAccordionItem
}
    from 'mdb-react-ui-kit';
import SideNavForStaff from '../../Component/SideNavForStaff/SideNavForStaff';
import { toast } from 'react-toastify';
import refreshPage from '../../Helpers/RefreshPage';

export default function ServiceBills() {
    const [billList, setBillList] = useState([]);
    const [filteredBillList, setFilteredBillList] = useState([]);
    const [groupedBillList, setGroupedBillList] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [isPaidClicked, setIsPaidClicked] = useState(false);

    const handleSearchInputChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchInput(value);
        if (value === '') {
            setFilteredBillList(billList);
        } else {
            setFilteredBillList(billList.filter(acc =>
                acc.orderId.toLowerCase().includes(value)
            ));
        }
        groupedBillList.filter(a => a.orderId == searchInput);
    };
    const handleOnPaidClick = async (orderId) => {
        const fetchData = async (orderId) => {
            const response = await fetch(`https://localhost:7206/api/service-order-management/service-orders/${orderId}/paid`, {
                method: 'PUT',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("An error occurred");
            }

            const data = await response.json();
            if (data && data.message === 'Paid failed') {
                throw new Error("Payment failed");
            }
            return data;
        };

        setIsPaidClicked(true); // Assuming this state management is required

        toast.promise(
            fetchData(orderId)
                .then(() => {
                    toast.success('Order paid');
                    console.log('Payment successful');
                    refreshPage(); // Call the function to refresh the page
                })
                .catch(error => {
                    toast.error(error.message);
                })
                .finally(() => {
                    setIsPaidClicked(false); // Ensure this runs regardless of promise outcome
                }),
            {
                pending: 'Processing payment...',
                success: 'Payment processed successfully!',
                error: {
                    render({ data }) {
                        return `Failed to process payment: ${data.message}`;
                    }
                }
            }
        );
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`https://localhost:7206/api/service-order-detail-management/service-order-details`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (data) {
                    console.log(data);
                    setBillList(data);
                    setFilteredBillList(data);
                    console.log(data);
                }
                else setBillList([]);
            } catch (error) {
                toast.error(error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (billList != []) {
            const groupedServices = filteredBillList.reduce((acc, service) => {
                const { orderId } = service;
                if (!acc[orderId]) {
                    acc[orderId] = [];
                }
                acc[orderId].push(service);
                return acc;
            }, {});
            // Convert the grouped services object to an array
            let arr = Object.keys(groupedServices).map(orderId => ({
                orderId,
                services: groupedServices[orderId]
            }));
            setGroupedBillList(arr);
            console.log(arr);
        }
    }, [filteredBillList, billList]);


    useEffect(() => {
        if (isPaidClicked) {
            setIsPaidClicked(true);
        }
    }, [isPaidClicked]);
    return (
        <>
            <SideNavForStaff searchInput={searchInput} handleSearchInputChange={handleSearchInputChange} />
            <MDBAccordion initialActive={1}>
                {groupedBillList.map((bill, index) => (
                    <MDBAccordionItem
                        key={bill.orderId}
                        collapseId={`collapseId-${index}`}
                        headerTitle={`Order ID: ${bill.orderId}`}
                    >
                        {bill.services.map((service, serviceIndex) => (
                            <div key={serviceIndex}>
                                <p className='fw-bold mb-1'>{service.serviceName}</p>
                                <p className='text-muted mb-0'>${service.price}</p>
                            </div>
                        ))}
                        <MDBBtn onClick={() => handleOnPaidClick(bill.orderId)}>Paid</MDBBtn>
                    </MDBAccordionItem>
                ))}
            </MDBAccordion>
        </>
    );
}