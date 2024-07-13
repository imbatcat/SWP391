import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBTypography
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import './App.css';
import MainLayout from '../../Layouts/MainLayout';
import img1 from '../../assets/images/about1.jpg';
import img2 from '../../assets/images/about2.jpg';

function AboutUs() {
  return (
    <div>
 <MainLayout>
 <br/>
    <MDBContainer>
      <header className="my-5 text-center">
        <MDBTypography  tag="h1" className="display-4 font-weight-bold">
          About Us
        </MDBTypography>
        <MDBTypography tag="p" className="lead text-muted">
          Your trusted partner in pet care
        </MDBTypography>
      </header>

      <section className="mb-5">
        <MDBRow>
          <MDBCol md="6">
            <MDBCard style={{height:'100%'}}>
              <MDBCardImage
                src={img2}
                alt="Our team"
                position="top"
                
              />
              <MDBCardBody>
                <MDBCardTitle>Our Team</MDBCardTitle>
                <MDBCardText>
                  Our experienced and compassionate team is dedicated to providing the best care for your pets.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="6">
            <MDBCard>
              <MDBCardImage
                src={img1}
                alt="Our mission"
                position="top"

              />
              <MDBCardBody>
                <MDBCardTitle>Our Mission</MDBCardTitle>
                <MDBCardText>
                  We strive to enhance the health and well-being of your pets through high-quality veterinary care and exceptional customer service.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </section>

      <section className="mb-5">
        <MDBTypography tag="h2" className="text-center mb-4">
          Why Choose Us
        </MDBTypography>
        <MDBRow>
          <MDBCol md="4">
            <MDBCard className="text-center">
              <MDBCardBody>
                <MDBIcon fas icon="stethoscope" size="3x" className="mb-3" />
                <MDBCardTitle>Experienced Veterinarians</MDBCardTitle>
                <MDBCardText>
                  Our vets have years of experience in providing top-notch care for pets.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="4">
            <MDBCard className="text-center">
              <MDBCardBody>
                <MDBIcon fas icon="paw" size="3x" className="mb-3" />
                <MDBCardTitle>Comprehensive Services</MDBCardTitle>
                <MDBCardText>
                  From routine check-ups to specialized treatments, we offer a wide range of services.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="4">
            <MDBCard className="text-center">
              <MDBCardBody>
                <MDBIcon fas icon="heart" size="3x" className="mb-3" />
                <MDBCardTitle>Compassionate Care</MDBCardTitle>
                <MDBCardText>
                  We treat every pet as if they were our own, with love and compassion.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </section>

    </MDBContainer>
    </MainLayout>
    </div>

  );
}

export default AboutUs;
