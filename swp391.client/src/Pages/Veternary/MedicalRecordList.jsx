import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBIcon,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBInput,
} from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';
import { useUser } from '../../Context/UserContext';
import MainLayout from '../../Layouts/MainLayout';
import { toast } from 'react-toastify';
import UserSidebar from '../../Component/UserSidebar/UserSidebar';
import CircularProgressWithLabel from '../../Component/CircularProgress/CircularProgressWithLabel';

function UserProfile() {
  const [user, setUser] = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [modal, setModal] = useState(false);
  const [editDetails, setEditDetails] = useState({});

  const toggleModal = () => setModal(!modal);

  const getUserDetails = async (user) => {
    try {
      const response = await fetch(
        `https://localhost:7206/api/account-management/accounts/${user.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('Error fetching data');
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(
        `https://localhost:7206/api/account-management/accounts/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(editDetails),
        }
      );
      if (!response.ok) {
        throw new Error('Error updating profile');
      }
      toast.success('Profile updated successfully!');
      getUserDetails(user);
      toggleModal();
    } catch (error) {
      toast.error('Error updating profile!');
      console.error(error.message);
    }
  };

  if (isLoading) {
    return (
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
                    <MDBCol
                      lg="8"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <CircularProgressWithLabel value={progress} />
                    </MDBCol>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      </MainLayout>
    );
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
                      <MDBCol sm="7">
                        <MDBCardText className="text-muted">
                          {userDetails.fullName}
                        </MDBCardText>
                      </MDBCol>
                      <MDBCol sm="2">
                        <MDBIcon fas icon="edit" onClick={toggleModal} />
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Username</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">
                          {userDetails.username}
                        </MDBCardText>
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
                            <MDBCardText className="text-muted">
                              {userDetails.dateOfBirth}
                            </MDBCardText>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                      </>
                    )}
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Email</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">
                          {userDetails.email}
                        </MDBCardText>
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
                            <MDBCardText className="text-muted">
                              {userDetails.phoneNumber}
                            </MDBCardText>
                          </MDBCol>
                        </MDBRow>
                      </>
                    )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      </MainLayout>

      <MDBModal tabIndex="-1" show={modal} setShow={setModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Edit Profile</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="Full Name"
                name="fullName"
                value={editDetails.fullName || userDetails.fullName}
                onChange={handleEditChange}
                required
              />
              <MDBInput
                label="Username"
                name="username"
                value={editDetails.username || userDetails.username}
                onChange={handleEditChange}
                required
              />
              <MDBInput
                label="Email"
                name="email"
                value={editDetails.email || userDetails.email}
                onChange={handleEditChange}
                required
              />
              {userDetails.phoneNumber && (
                <MDBInput
                  label="Phone"
                  name="phoneNumber"
                  value={editDetails.phoneNumber || userDetails.phoneNumber}
                  onChange={handleEditChange}
                  required
                />
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleModal}>
                Close
              </MDBBtn>
              <MDBBtn color="primary" onClick={handleUpdateProfile}>
                Save changes
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

export default UserProfile;
