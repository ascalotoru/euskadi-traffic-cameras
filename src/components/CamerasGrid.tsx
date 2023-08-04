import React, { useEffect, useState } from 'react'
import { Camera, CameraCard } from './CameraCard';
import "../assets/CamerasGrid.css";
import { Empty } from './Empty';

type CamarasGridProps = {
  selectedMenu: string
  cameras: Camera[];
}

export const CamarasGrid: React.FC<CamarasGridProps> = (props) => {
  const {selectedMenu, cameras} = props;
  let camerasToShow: Camera[] = cameras;
  let favoriteMenu = false;

  const [favorites, setFavorites] = useState<Camera[]>(() => {
    const storedValue = localStorage.getItem("favorites");
    return storedValue ? JSON.parse(storedValue) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites])
  
  if (selectedMenu === "Favoritos") {
    camerasToShow = favorites;
    favoriteMenu = true;
  }

  if (camerasToShow.length === 0) {
    return <Empty />
  }

  return (
    <ul className="camerasGrid">
      {camerasToShow.map( (camera) => (
        <CameraCard
          key={camera.cameraId}
          camera={camera}
          favorites={favorites}
          setFavorites={setFavorites}
          favoriteMenu={favoriteMenu}
        />
      ))}
    </ul>
  )
}
