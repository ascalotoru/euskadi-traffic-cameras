import { Camera } from "../components/CameraCard";

const API = "https://api.euskadi.eus/traffic/v1.0"

interface FullResponse {
  currentPage: number,
  totalItems: number,
  totalPages: number,
  cameras: Camera[]
}

const headers = {
  "Accept": "application/json"
}

let cameras: Camera[] = [];

const fetchCameras = async (page: string = "1", source: string = "2") => {
  const res = await fetch(`${API}/cameras/bySource/${source}?_page=${page}`, {
    headers: headers
  });
  return res.json();
}

export const getAllCameras = async (source: string, page: number = 1, allCameras: Camera[] = []): Promise<Camera[]> => {
  try{
    const fullResponse: FullResponse = await fetchCameras(page.toString(), source);
    const camerasWithUrlImage = fullResponse.cameras.filter(camera => camera.urlImage !== undefined)
    // const regexArray = [ /^CCTV\s*\d+\s*-\s*/gi, /^DOMO\s*-?\s*AP-?\d+\s*-\s*/gi, ];
    const re = /(?:DOMO\s*\d*\s*-?\s*|CCTV\s*\d*\s*-?\s*)?(AP-8\s+\S+|.*$)/gmi
    const camerasWithGoodName = camerasWithUrlImage.map( camera => {
      // for (const regex of regexArray) {
      camera.cameraName = camera.cameraName.replace(re, "$1");
      // }
      return { ...camera }
    })
    cameras = [...allCameras, ...camerasWithGoodName]

    if (page < fullResponse.totalPages) {
      // Si hay más páginas, llamamos recursivamente a getAllCameras con la siguiente página
      return getAllCameras(source, page + 1, cameras);
    } else{
      // Si no hay más páginas, hemos terminado, y podemos mostrar las cámaras
      return cameras;
    }
  } catch (error) {
    console.error("Error obtaining cameras:", error);
    return [] as Camera[];
  }

}