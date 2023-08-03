import React, { useEffect, useState } from 'react'
import { Camera, CameraCard } from './CameraCard';
import "../assets/CamerasGrid.css";
import { Empty } from './Empty';

type CamarasGridProps = {
  selectedMenu: string;
  cameras: Camera[];
}

export const CamarasGrid: React.FC<CamarasGridProps> = ({ selectedMenu, cameras }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [camerasToShow, setCamarasToShow] = useState<Camera[]>([]);

  const [favorites, setFavorites] = useState<Camera[]>(() => {
    const storedValue = localStorage.getItem("favorites");
    return storedValue ? JSON.parse(storedValue) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites])
  

  // useEffect( () => {
  //   if (selectedMenu === "Favoritos") {
  //     const favoriteCameras = cameras.filter((camera) => favoritos.includes(camera.cameraId));
  //     setCamarasToShow(favoriteCameras);
  //   } else {
  //     setCamarasToShow(cameras);
  //   }
  //   setIsLoading(false);
  // }, [cameras]);  

  if (isLoading && camerasToShow.length === 0) {
    return <Empty />
  }

  return (
    <ul className="camerasGrid">
      {camerasToShow.map( (camera) => (
        <CameraCard key={camera.cameraId} camera={camera} favorites={favorites} setFavorites={setFavorites}/>
      ))}
    </ul>
  )
}
