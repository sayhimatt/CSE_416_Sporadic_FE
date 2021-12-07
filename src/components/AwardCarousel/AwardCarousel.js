import React from "react";
import Carousel from "react-bootstrap/Carousel";

import "./styles.scss";

const AwardCarousel = ({ awards }) => {
  return (
    <Carousel variant="dark" className="award-carousel">
      {awards.map((award, index) => (
        <Carousel.Item className="award-carousel-item">
          <div className="award-carousel-image-container">
            <img className="award-carousel-image" alt={`award-${index}`} src={award.image} />
          </div>
          <Carousel.Caption>
            <h5>{award.title}</h5>
            <p>{`Earned from ${award.quiz}`}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default AwardCarousel;
