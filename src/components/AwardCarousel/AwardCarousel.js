import React from "react";
import Carousel from "react-bootstrap/Carousel";

const AwardCarousel = ({ children, awards }) => {
  return (
    <Carousel interval={3000}>
      {awards.map((award, index) => (
        <Carousel.Item>
          <img className="award-carousel-image" alt={`award-${index}`} src={award.image} />
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
