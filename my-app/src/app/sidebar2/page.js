import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/style.css'
import { fabric } from 'fabric';

const images = [
  'https://svgsilh.com/svg/1010280.svg',
  'https://svgsilh.com/svg_v2/1295053.svg',
  'https://lh5.googleusercontent.com/proxy/L9AD6xljrODr6I6kQpZPk0_qb_72r9gizmQEzq0tyHWbJANVIXFe-vlYnW4ruIqUbd_7eOWfMGdBVbg_e2YuhtEUdxR3W3jMwQ=w1600',
  
];

const SliderComponent2 = ({ canvas }) => {
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

export default SliderComponent2;
