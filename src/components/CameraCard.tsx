  import React from 'react'
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
    camera: Camera,
    favorites: Camera[],
    setFavorites: React.Dispatch<React.SetStateAction<Camera[]>>
  }

  export const CameraCard: React.FC<CameraCardProps> = (props) => {
    const { camera, favorites, setFavorites } = props;
    
    const isFavorite = favorites.some((fav) => fav.cameraId === camera.cameraId);
    
    const handleClick = () => {
      if (isFavorite) {
        setFavorites(favorites.filter((fav) => fav.cameraId !== camera.cameraId));
      } else {
        setFavorites([...favorites, camera]);
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