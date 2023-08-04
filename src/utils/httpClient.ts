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

const fetchCameras = async (page: string = "1", source: string = "2") => {
  const res = await fetch(`${API}/cameras/bySource/${source}?_page=${page}`, {
    headers: headers
  });
  return res.json();
}

export const getAllCameras = async (source: string, page: number = 1, allCameras: Camera[] = []): Promise<Camera[]> => {
  try{
    const fullResponse: FullResponse = await fetchCameras(page.toString(), source);
    const totalPages = fullResponse.totalPages;

    const fetchPromises: Promise<FullResponse>[] = [];
    for (let page=2; page <= totalPages; page++){
      fetchPromises.push(fetchCameras(page.toString(), source));
    }
    const responses = await Promise.all(fetchPromises);
    const allCameras: Camera[] = [];
    const re = /(?:DOMO\s*\d*\s*-?\s*|CCTV\s*\d*\s*-?\s*)?(AP-8\s+\S+|.*$)/gmi
    responses.forEach( (response) => {
      const camerasWithUrlImage = response.cameras.filter(camera => camera.urlImage !== undefined)
      const camerasWithGoodName = camerasWithUrlImage.map( camera => {
        camera.cameraName = camera.cameraName.replace(re, "$1");
        return camera;
      });
      allCameras.push(...camerasWithGoodName);
    });
      return allCameras;
    } catch (error) {
    console.error("Error obtaining cameras:", error);
    return [] as Camera[];
  }

}