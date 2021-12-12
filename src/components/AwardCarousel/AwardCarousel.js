import React from "react";
import Carousel from "react-bootstrap/Carousel";

import "./styles.scss";

const AwardCarousel = ({ awards }) => {
  return (
    <Carousel variant="dark" className="award-carousel">
      {!awards || awards.length === 0 ? (
        <Carousel.Item className="award-carousel-item">
          <div className="d-flex flex-column justify-content-center h-100 align-items-center">
            <h5>There are no awards on display!</h5>
          </div>
        </Carousel.Item>
      ) : (
        awards.map((award, index) => (
          <Carousel.Item key={`award-${index}`} className="award-carousel-item">
            <div className="award-carousel-image-container">
              <img className="award-carousel-image" alt={`award-${index}`} src={award.image} />
            </div>
            <Carousel.Caption>
              <h5>{award.title}</h5>
              <p>{`Earned from ${award.quiz} on /p/${award.platform}`}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))
      )}
    </Carousel>
  );
};

export default AwardCarousel;
