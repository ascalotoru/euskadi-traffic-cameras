import React, { useEffect, useState } from 'react'
import { CamarasGrid } from './components/CamerasGrid';
import { Menu } from './components/Menu';
import './assets/App.css';
import { Camera } from './components/CameraCard';
import { getAllCameras } from './utils/httpClient';

export const App = () => {
  const [selectedMenu, setSelectedMenu] = useState('Bizkaia');
  const [allCameras, setAllCameras] = useState<Camera[]>([]);

  useEffect(() => {
    const sourceId = selectedMenu === 'Bilbao' ? '5' : '2';
    getAllCameras(sourceId)
      .then((data) => {
        setAllCameras(data);
      })
      .catch((error) => {
        console.log("Error obtaining cameras", error);
      })
  }, [selectedMenu])
  
  return (
    <>
      <header className='header'>
        <h1 className='title'>Cámaras Tráfico</h1>
      </header>
      <main>
        <Menu selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />
        { selectedMenu === "Favoritos" ? (
          <CamarasGrid selectedMenu={selectedMenu} cameras={allCameras} />
        ) : (
          <CamarasGrid selectedMenu={selectedMenu} cameras={allCameras} />
        )}
      </main>
    </>
  )
}
