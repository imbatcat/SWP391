import React from 'react';
import { MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';
import img4 from '../../assets/images/hero4.png'
import img1 from '../../assets/images/hero1.png'
import img2 from '../../assets/images/hero2.png'
import img3 from '../../assets/images/hero3.png'

import './Hero.css';
export default function Hero() {
  return (
    <MDBCarousel showIndicators showControls >
      <MDBCarouselItem itemId={1}>
        <img src={img4} className='d-block w-100 img-fit ' alt='...' />
        <MDBCarouselCaption>Pet-ternary</MDBCarouselCaption>
      </MDBCarouselItem>

      <MDBCarouselItem itemId={2}>
        <img src={img1} className='d-block w-100 img-fit ' alt='...' />
        <MDBCarouselCaption>Purr-fectly Healthy</MDBCarouselCaption>
      </MDBCarouselItem>


      <MDBCarouselItem itemId={3}>
        <img src={img2} className='d-block w-100 img-fit ' alt='...' />
        <MDBCarouselCaption>Woof-tastically Happy</MDBCarouselCaption>
      </MDBCarouselItem>


      <MDBCarouselItem itemId={4}>
        <img src={img3} className='d-block w-100 img-fit ' alt='...' />
        <MDBCarouselCaption>Make Appointment Now!</MDBCarouselCaption>
      </MDBCarouselItem>
    </MDBCarousel>
  );
}