'use client'

import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import './styles.css';
import SliderComponent from './Sidebar';
import SliderComponent2 from './Sidebar2';

const PmageEditor = () => {

  const [canvas, setCanvas] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(500); 
  const [canvasHeight, setCanvasHeight] = useState(500);
  const canvasRef = useRef(null);

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current);
    setCanvas(newCanvas);
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.setWidth(canvasWidth);
      canvas.setHeight(canvasHeight);
      canvas.renderAll();
    }
  }, [canvas, canvasWidth, canvasHeight]);

  const handleCanvasSizeChange = () => {
    const newWidth = parseInt(document.getElementById('canvasWidthInput').value, 10);
    const newHeight = parseInt(document.getElementById('canvasHeightInput').value, 10);
    setCanvasWidth(newWidth);
    setCanvasHeight(newHeight);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const imageSrc = event.dataTransfer.getData('text/plain');

    fabric.Image.fromURL(imageSrc, (img) => {
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      const maxWidth = canvasWidth * 0.8; 
      const maxHeight = canvasHeight * 0.8; 
      
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
        left: event.clientX - canvas._offset.left,
        top: event.clientY - canvas._offset.top,
      });

      canvas.add(img);
      setBackgroundImage(img);
      canvas.renderAll();
    });
  };

  const handleImageLoad = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (f) => {
      const data = f.target.result;

      fabric.Image.fromURL(data, (img) => {
        img.scaleToWidth(canvas.getWidth());
        img.scaleToHeight(canvas.getHeight());
        canvas.add(img);
        setBackgroundImage(img);
      });
    };

    reader.readAsDataURL(file);
  };

  const enableEditing = () => {
    canvas.isDrawingMode = true; 
    canvas.forEachObject((obj) => {
      obj.set('selectable', true);
      obj.set('evented', true);
    });
    canvas.selection = true;
    canvas.renderAll();
  };

  const disableEditing = () => {
    canvas.isDrawingMode = false;
    canvas.forEachObject((obj) => {
      obj.set('selectable', false);
      obj.set('evented', false);
    });
    canvas.selection = false;
    canvas.renderAll();
  };

  const handleColorChange = (event) => {
    const color = event.target.value;
    canvas.freeDrawingBrush.color = color;
  };

  const handleBrushSizeChange = (event) => {
    const size = parseInt(event.target.value);
    canvas.freeDrawingBrush.width = size;
  };

  const handleRemoveBackground = () => {
    if (backgroundImage) {
      canvas.remove(backgroundImage);
      setBackgroundImage(null);
      canvas.renderAll();
    }
  };

 

  const handleCanvasClick = (event) => {
    if (selectedImage) {
      const image = new Image();
      image.src = selectedImage;
      image.onload = () => {
        const fabricImage = new fabric.Image(image);
        fabricImage.set({
          left: event.clientX - canvas._offset.left,
          top: event.clientY - canvas._offset.top,
        });
        canvas.add(fabricImage);
        setBackgroundImage(fabricImage);
        setSelectedImage(null);
        canvas.renderAll();
      };
    }
  };

  const handleBrightnessChange = (event) => {
    const isChecked = event.target.checked;
    const brightnessValue = parseFloat(event.target.value);
    const activeObject = canvas.getActiveObject();
  
    if (activeObject) {
      if (isChecked) {
        const brightnessFilter = new fabric.Image.filters.Brightness({
          brightness: brightnessValue
        });
        activeObject.filters.push(brightnessFilter);
      } else {
        activeObject.filters = activeObject.filters.filter(
          (filter) => !(filter instanceof fabric.Image.filters.Brightness)
        );
      }
  
      activeObject.applyFilters();
      canvas.requestRenderAll();
    }
  };
  
  const handleBrightnessRangeChange = (event) => {
    const brightnessValue = parseFloat(event.target.value);
    const activeObject = canvas.getActiveObject();
  
    if (activeObject) {
      const brightnessFilter = activeObject.filters.find(
        (filter) => filter instanceof fabric.Image.filters.Brightness
      );
  
      if (brightnessFilter) {
        brightnessFilter.brightness = brightnessValue;
        activeObject.applyFilters();
        canvas.requestRenderAll();
      }
    }
  };
  const handleBringToFront = () => {
    const selectedObjects = canvas.getActiveObjects();
    if (selectedObjects && selectedObjects.length > 0) {
      canvas.discardActiveObject(); 
  
      selectedObjects.forEach((object) => {
        canvas.bringToFront(object);
      });
  
      canvas.renderAll();
    }
  };

  const handleBringToBack = () => {
    const selectedObjects = canvas.getActiveObjects();
    if (selectedObjects && selectedObjects.length > 0) {
      canvas.discardActiveObject(); 
  
      selectedObjects.forEach((object) => {
        canvas.sendToBack(object);
      });
  
      canvas.renderAll();
    }
  };
  

  return (
    <>
      <div className="row">
        <div className="side">
          <h3>Upload Image</h3>
          <input type="file" id="imageLoader" onChange={handleImageLoad} />
          <h3>PNG Images</h3>
          <SliderComponent canvas={canvas} handleRemoveBackground={handleRemoveBackground} />
          <h3>SVG Images</h3>
          <SliderComponent2 canvas={canvas} />


          <h3>Controls</h3>
          <label  >
           <h3> Brightness</h3>
            <input
              type="checkbox"
              onChange={handleBrightnessChange}
              value="0.5"
            />
          </label>
          <input
            type="range"
            id="brightness-range"
            min="0"
            max="2"
            step="0.1"
            defaultValue="1"
            onChange={handleBrightnessRangeChange}
          />
          <button className="button" onClick={enableEditing}>
            Enable Editing
          </button>
          <button className="button" onClick={disableEditing}>
            Disable Editing
          </button>
          <button className="button" onClick={handleRemoveBackground}>
            Remove Background Image
          </button>
          <button className="button" onClick={handleBringToFront}>
            Bring front
          </button>
          <button className="button" onClick={handleBringToBack}>
            Send Back
          </button>

          <h3>Change Color</h3>
          <input type="color" id="colorPicker" onChange={handleColorChange} />
          <select onChange={handleBrushSizeChange}>
            <option value="20">Small</option>
            <option value="30">Medium</option>
            <option value="40">Large</option>
          </select>
        </div>


        <div className="canvas-container">
          <h3>Canvas Dimensions</h3>
          <div className="canvas-dimensions">
            <label htmlFor="canvasWidthInput">Width:</label>
            <input
              type="number"
              id="canvasWidthInput"
              className="dimension-input"
              value={canvasWidth}
              onChange={handleCanvasSizeChange}
            />
            <span className="dimension-unit">px</span>
          </div>
          <div className="canvas-dimensions">
            <label htmlFor="canvasHeightInput">Height:</label>
            <input
              type="number"
              id="canvasHeightInput"
              className="dimension-input"
              value={canvasHeight}
              onChange={handleCanvasSizeChange}
            />
            <span className="dimension-unit">px</span>
          </div>


          <canvas
            id="canvas"
            ref={canvasRef}
            
            style={{ border: '2px solid black' }}
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
            onClick={handleCanvasClick}
          ></canvas>
        </div>

      </div>
    </>
  );
};

export default PmageEditor;