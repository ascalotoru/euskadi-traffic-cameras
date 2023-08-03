import React, { useEffect, useState } from 'react'
import { CamarasGrid } from './components/CamerasGrid';
import { Menu } from './components/Menu';
import './assets/App.css';
import { Camera } from './components/CameraCard';
import { getAllCameras } from './utils/httpClient';

const FAVORITOS_KEY = "favoritos";

export const App = () => {
  const [selectedMenu, setSelectedMenu] = useState('Bizkaia');
  const [favoritos, setFavoritos] = useState<string[]>( () => {
    const storedFavoritos = localStorage.getItem(FAVORITOS_KEY);
    return storedFavoritos ? JSON.parse(storedFavoritos) : [];
  });
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
  
  // useEffect(() => {
  //   localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
  // }, [favoritos]);

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
