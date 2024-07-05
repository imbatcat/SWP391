import {
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCol,
    MDBContainer,
    MDBRow
} from 'mdb-react-ui-kit';
import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import MainLayout from "../../Layouts/MainLayout";
import { toast } from 'react-toastify';
import UserSidebar from '../../Component/UserSidebar/UserSidebar';

function UserProfile() {
    const [user, setUser] = useUser();
    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getUserDetails = async (user) => {
        try {
            const response = await fetch(`https://localhost:7206/api/account-management/accounts/${user.id}`, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error("Error fetching data");
            }
            var userData = await response.json();
            setUserDetails(userData);
        } catch (error) {
            toast.error('Error getting user details!');
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        if (user) {
            getUserDetails(user);
        }
    }, [user]);

    if (isLoading) {
        return <div>Loading...</div>; // Loading state
    }
    return (
        <>
            <MainLayout>
                <section style={{ backgroundColor: '#eee' }}>
                    <MDBContainer className="py-5">

                        <MDBRow>
                            <MDBCol lg="4">
                                <UserSidebar></UserSidebar>
                            </MDBCol>
                            <MDBCol lg="8">
                                <MDBCard className="mb-4">
                                    <MDBCardBody>
                                        <MDBRow>
                                            <MDBCol sm="3">
                                                <MDBCardText>Full Name</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <MDBCardText className="text-muted">{userDetails.fullName}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>
                                        <hr></hr>
                                        <MDBRow>
                                            <MDBCol sm="3">
                                                <MDBCardText>Username</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <MDBCardText className="text-muted">{userDetails.username}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>
                                        {userDetails.dateOfBirth && (
                                            <>
                                                <hr />
                                                <MDBRow>
                                                    <MDBCol sm="3">
                                                        <MDBCardText>Date of birth</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol sm="9">
                                                        <MDBCardText className="text-muted">{userDetails.dateOfBirth}</MDBCardText>
                                                    </MDBCol>
                                                </MDBRow>
                                                <hr></hr>
                                            </>
                                        )}
                                        <hr></hr>
                                        <MDBRow>
                                            <MDBCol sm="3">
                                                <MDBCardText>Email</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <MDBCardText className="text-muted">{userDetails.email}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>
                                        {userDetails.phoneNumber && (
                                            <>
                                                <hr />
                                                <MDBRow>
                                                    <MDBCol sm="3">
                                                        <MDBCardText>Phone</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol sm="9">
                                                        <MDBCardText className="text-muted">{userDetails.phoneNumber}</MDBCardText>
                                                    </MDBCol>
                                                </MDBRow>
                                            </>
                                        )}
                                    </MDBCardBody>
                                </MDBCard>

                                {/*    <MDBRow>*/}
                                {/*        <MDBCol md="6">*/}
                                {/*            <MDBCard className="mb-4 mb-md-0">*/}
                                {/*                <MDBCardBody>*/}
                                {/*                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">assigment</span> Project Status</MDBCardText>*/}
                                {/*                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</MDBCardText>*/}
                                {/*                    <MDBProgress className="rounded">*/}
                                {/*                        <MDBProgressBar width={80} valuemin={0} valuemax={100} />*/}
                                {/*                    </MDBProgress>*/}

                                {/*                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</MDBCardText>*/}
                                {/*                    <MDBProgress className="rounded">*/}
                                {/*                        <MDBProgressBar width={72} valuemin={0} valuemax={100} />*/}
                                {/*                    </MDBProgress>*/}

                                {/*                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</MDBCardText>*/}
                                {/*                    <MDBProgress className="rounded">*/}
                                {/*                        <MDBProgressBar width={89} valuemin={0} valuemax={100} />*/}
                                {/*                    </MDBProgress>*/}

                                {/*                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</MDBCardText>*/}
                                {/*                    <MDBProgress className="rounded">*/}
                                {/*                        <MDBProgressBar width={55} valuemin={0} valuemax={100} />*/}
                                {/*                    </MDBProgress>*/}

                                {/*                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</MDBCardText>*/}
                                {/*                    <MDBProgress className="rounded">*/}
                                {/*                        <MDBProgressBar width={66} valuemin={0} valuemax={100} />*/}
                                {/*                    </MDBProgress>*/}
                                {/*                </MDBCardBody>*/}
                                {/*            </MDBCard>*/}
                                {/*        </MDBCol>*/}

                                {/*        <MDBCol md="6">*/}
                                {/*            <MDBCard className="mb-4 mb-md-0">*/}
                                {/*                <MDBCardBody>*/}
                                {/*                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">assigment</span> Project Status</MDBCardText>*/}
                                {/*                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</MDBCardText>*/}
                                {/*                    <MDBProgress className="rounded">*/}
                                {/*                        <MDBProgressBar width={80} valuemin={0} valuemax={100} />*/}
                                {/*                    </MDBProgress>*/}

                                {/*                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</MDBCardText>*/}
                                {/*                    <MDBProgress className="rounded">*/}
                                {/*                        <MDBProgressBar width={72} valuemin={0} valuemax={100} />*/}
                                {/*                    </MDBProgress>*/}

                                {/*                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</MDBCardText>*/}
                                {/*                    <MDBProgress className="rounded">*/}
                                {/*                        <MDBProgressBar width={89} valuemin={0} valuemax={100} />*/}
                                {/*                    </MDBProgress>*/}

                                {/*                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</MDBCardText>*/}
                                {/*                    <MDBProgress className="rounded">*/}
                                {/*                        <MDBProgressBar width={55} valuemin={0} valuemax={100} />*/}
                                {/*                    </MDBProgress>*/}

                                {/*                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</MDBCardText>*/}
                                {/*                    <MDBProgress className="rounded">*/}
                                {/*                        <MDBProgressBar width={66} valuemin={0} valuemax={100} />*/}
                                {/*                    </MDBProgress>*/}
                                {/*                </MDBCardBody>*/}
                                {/*            </MDBCard>*/}
                                {/*        </MDBCol>*/}
                                {/*    </MDBRow>*/}
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </section>
            </MainLayout >
        </>
    );
}

export default UserProfile;