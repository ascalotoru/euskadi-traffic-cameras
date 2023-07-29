import React, { useEffect, useState } from 'react'
import { Camera, CameraCard } from './CameraCard';
import "../assets/CamerasGrid.css";
import { Empty } from './Empty';

type CamarasGridProps = {
  selectedMenu: string;
  favoritos: string[];
  cameras: Camera[];
}

export const CamarasGrid: React.FC<CamarasGridProps> = ({ selectedMenu, favoritos, cameras }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [camerasToShow, setCamarasToShow] = useState<Camera[]>([]);

  useEffect( () => {
    if (selectedMenu === "Favoritos") {
      const favoriteCameras = cameras.filter((camera) => favoritos.includes(camera.cameraId));
      setCamarasToShow(favoriteCameras);
    } else {
      setCamarasToShow(cameras);
    }
    setIsLoading(false);
  }, [favoritos, cameras]);  

  if (isLoading && camerasToShow.length === 0) {
    return <Empty />
  }

  return (
    <ul className="camerasGrid">
      {camerasToShow.map( (camera) => (
        <CameraCard key={camera.cameraId} camera={camera} />
      ))}
    </ul>
  )
}
