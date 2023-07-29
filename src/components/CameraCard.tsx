  import React, { useEffect, useState } from 'react'
  import "../assets/CameraCard.css";

  export interface Camera {
    address:    string;
    cameraId:   string;
    cameraName: string;
    kilometer:  string;
    latitude:   string;
    longitude:  string;
    road:       string;
    sourceId:   string;
    urlImage?:   string;
  }

  interface CameraCardProps {
    camera: Camera
  }

  export const CameraCard: React.FC<CameraCardProps> = ({ camera }) => {
    const [favorites, setFavorites] = useState<Camera[]>(() => {
      const storedValue = localStorage.getItem("favorites");
      return storedValue ? JSON.parse(storedValue) : [];
    })

    const isFavorite = favorites.some((fav) => fav.cameraId === camera.cameraId);
    
    useEffect(() => {
      localStorage.setItem("favorites",JSON.stringify(favorites));
    }, [favorites]);

    const handleClick = () => {
      if (isFavorite) {
        // Si la cámara actual ya es una favorita, la deseleccionamos
        // Filtramos el array de favoritos para eliminar la cámara actual de la lista
        setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.cameraId !== camera.cameraId));
      } else {
        // Si la cámara actual no es una favorita, la seleccionamos
        // Añadimos la cámara actual al array de favoritos
        if (!favorites.some((fav) => fav.cameraId === camera.cameraId)) {
          setFavorites((prevFavorites) => [...prevFavorites, camera]);
        }
      }
    }

    const cardClassName = `cameraCard ${isFavorite ? "selected" : "" }`;

    return (
      <li onClick={handleClick} className={cardClassName}>
        <div>{camera.cameraName}</div>
        <img
          width={320}
          className="cameraImage"
          src={camera.urlImage}
          alt={camera.address}
        />
        <div className="cameraAddress">Sentido: {camera.address}</div>
      </li>
    )
  }