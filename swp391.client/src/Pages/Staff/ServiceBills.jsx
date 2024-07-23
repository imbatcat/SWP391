import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBAccordion,
  MDBAccordionItem,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import SideNavForStaff from '../../Component/SideNavForStaff/SideNavForStaff';
import { toast } from 'react-toastify';
import refreshPage from '../../Helpers/RefreshPage';

export default function ServiceBills() {
  const [billList, setBillList] = useState([]);
  const [filteredBillList, setFilteredBillList] = useState([]);
  const [groupedBillList, setGroupedBillList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [isPaidClicked, setIsPaidClicked] = useState(false);
  const [buffer, setBuffer] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearchInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    if (value === '') {
      setFilteredBillList(billList);
    } else {
      setFilteredBillList(
        billList.filter(
          (acc) =>
            (acc.orderId && acc.orderId.toLowerCase().includes(value)) ||
            (acc.appointmentId &&
              acc.appointmentId.toLowerCase().includes(value)) ||
            acc.phoneNumber.includes(value) ||
            (acc.ownerName && acc.ownerName.toLowerCase().includes(value)) ||
            (acc.petName && acc.petName.toLowerCase().includes(value))
        )
      );
    }
  };

  const handleOnPaidClick = async (orderId) => {
    const fetchData = async (orderId) => {
      const response = await fetch(
        `https://localhost:7206/api/service-order-management/service-orders/${orderId}/paid`,
        {
          method: 'PUT',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('An error occurred');
      }
      if (response.status !== 200) throw new Error();
      const data = await response.json();
      return data;
    };

    setIsPaidClicked(true); // Assuming this state management is required

    toast
      .promise(
        fetchData(orderId).catch((error) => {
          console.log(error);
          setIsProcessing(false);
        }),
        {
          pending: 'Processing payment...',
          success: 'Payment processed successfully!',
          error: {
            render({ data }) {
              return `Failed to process payment: ${data.message}`;
            },
          },
        }
      )
      .then(() => {
        console.log('Payment successful');
        refreshPage();
        toast.success('Order paid');
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://localhost:7206/api/service-order-detail-management/service-order-details`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        const data = await response.json();
        if (data) {
          console.log(data);
          setBillList(data);
          setFilteredBillList(data);
        } else setBillList([]);
      } catch (error) {
        toast.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (billList.length > 0) {
      const groupedServices = filteredBillList.reduce((acc, service) => {
        const { orderId } = service;
        if (!acc[orderId]) {
          acc[orderId] = [];
        }
        acc[orderId].push(service);
        return acc;
      }, {});
      // Convert the grouped services object to an array
      let arr = Object.keys(groupedServices).map((orderId) => ({
        orderId,
        appointmentId: groupedServices[orderId][0].appointmentId,
        petName: groupedServices[orderId][0].petName,
        ownerName: groupedServices[orderId][0].ownerName,
        phoneNumber: groupedServices[orderId][0].phoneNumber,
        services: groupedServices[orderId],
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
      <SideNavForStaff
        searchInput={searchInput}
        handleSearchInputChange={handleSearchInputChange}
      />
      <MDBAccordion initialActive={1}>
        {groupedBillList.map((bill, index) => {
          const totalPrice = bill.services.reduce(
            (sum, service) => sum + service.price,
            0
          );
          return (
            <MDBAccordionItem
              style={{ width: '50%' }}
              key={bill.appointmentId}
              collapseId={`collapseId-${index}`}
              headerTitle={
                <MDBRow>
                  <MDBCol>
                    <strong>Pet name:</strong> {bill.petName}
                  </MDBCol>
                  <MDBCol>
                    <strong>Owner name:</strong> {bill.ownerName}
                  </MDBCol>
                  <MDBCol>
                    <strong>Phone number:</strong> {bill.phoneNumber}
                  </MDBCol>
                </MDBRow>
              }
            >
              {bill.services.map((service, serviceIndex) => (
                <div key={serviceIndex}>
                  <p className="fw-bold mb-1">{service.serviceName}</p>
                  <p className="text-muted mb-0">${service.price.toFixed(2)}</p>
                </div>
              ))}
              <div className="fw-bold mt-2">
                Total: ${totalPrice.toFixed(2)}
              </div>
              <MDBBtn onClick={() => handleOnPaidClick(bill.orderId)}>
                Paid
              </MDBBtn>
            </MDBAccordionItem>
          );
        })}
      </MDBAccordion>
    </>
  );
}
