import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fabric } from 'fabric';

const images = [
  'https://pngimg.com/uploads/lion/lion_PNG3809.png',
  'https://1.bp.blogspot.com/-4twOjh40ZCs/WMQUC8z8NiI/AAAAAAABgz4/UIxtU9XGzGMFEe-p7l-vYiw4EyaRDNSkQCEw/s1600/lion_PNG3806.png',
  'http://pluspng.com/img-png/png-wildlife--1120.png',
  'https://purepng.com/public/uploads/large/purepng.com-owl-sittingowlowletbrown-owlowl-from-the-side-4815210279097vhbr.png',
  'https://purepng.com/public/uploads/large/purepng.com-bearbearanimalwild-981524652489snf8h.png',
  'https://purepng.com/public/uploads/large/purepng.com-elephantelephantanimals-98152467510413y1z.png',

];

const SliderComponent = ({ canvas }) => {
  const handleImageClick = (imageSrc) => {
    fabric.Image.fromURL(imageSrc, (img) => {
      const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const maxWidth = canvasWidth * 0.8; // Limit the image width to 80% of the canvas width
    const maxHeight = canvasHeight * 0.8; // Limit the image height to 80% of the canvas height

    // Calculate the scaled dimensions while preserving the aspect ratio
    let newWidth = img.width;
    let newHeight = img.height;

    if (img.width > maxWidth) {
      const scaleFactor = maxWidth / img.width;
      newWidth = img.width * scaleFactor;
      newHeight = img.height * scaleFactor;
    }

    if (newHeight > maxHeight) {
      const scaleFactor = maxHeight / newHeight;
      newWidth *= scaleFactor;
      newHeight *= scaleFactor;
    }

    img.set({
      scaleX: newWidth / img.width,
      scaleY: newHeight / img.height,
      left: canvasWidth / 2 - newWidth / 2, // Center the image horizontally
      top: canvasHeight / 2 - newHeight / 2, // Center the image vertically
    });

    img.set({ crossOrigin: 'Anonymous' });


    img.on('mousedblclick', () => {
      canvas.remove(img);
      canvas.renderAll();
    }); // 

      canvas.add(img);
      canvas.renderAll();
    });
  };

  const customPrevArrow = <div className="custom-prev-arrow">Previous</div>;
  const customNextArrow = <div className="custom-next-arrow">Next</div>;

  const settings = {
    prevArrow: customPrevArrow,
    nextArrow: customNextArrow,
  };


  return (
    <>
    <Slider
    
    className="slider-container">
      {images.map((image, index) => (
        <div key={index} className="slider-item">
          <img
            src={image}
            height={100}
            alt={`Image ${index + 1}`}
            draggable="true"
            onClick={() => handleImageClick(image)}
          />
        </div>
      ))}
    </Slider>
    </>
  );
};

export default SliderComponent;
