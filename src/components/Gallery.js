import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: async (acceptedFiles) => {
      const uploaded = await Promise.all(
        acceptedFiles.map(file => 
          axios.post('/api/upload', file, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        )
      );
      setImages([...images, ...uploaded.map(res => res.data)]);
    }
  });

  const moveImage = (dragIndex, hoverIndex) => {
    const dragged = images[dragIndex];
    setImages(prev => {
      const updated = [...prev];
      updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, dragged);
      axios.put(`/api/reorder/${dragged.id}`, { newIndex: hoverIndex });
      return updated;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="gallery">
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag &amp; drop images here, or click to select</p>
        </div>
        
        <div className="image-grid">
          {images.map((img, index) => (
            <ImageItem
              key={img.id}
              image={img}
              index={index}
              moveImage={moveImage}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

const ImageItem = ({ image, index, moveImage }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'IMAGE',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'IMAGE',
    hover: (item) => {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    }
  });

  return (
    <div 
      ref={node => drag(drop(node))}
      className={`image-item ${isDragging ? 'dragging' : ''}`}
    >
      <img src={image.url} alt={image.alt} />
    </div>
  );
};

export default Gallery;
