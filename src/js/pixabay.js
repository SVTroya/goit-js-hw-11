import axios from "axios"

const URL_PIXABAY = "https://pixabay.com/api/"
const KEY_PIXABAY = "40532250-7000c5ca3f9409cc384b0640a"
export const IMG_PER_PAGE = 40

async function fetchImages(query, page) {
  const params = new URLSearchParams({
    key: KEY_PIXABAY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: IMG_PER_PAGE,
    page: page,
  })

  const response = await axios.get(`${URL_PIXABAY}?${params}`)
  return response.data
}

export async function getImagesByPage(page) {
  try {
    const {
      hits: foundImages,
      totalHits: totalImages
    } = await fetchImages(this.query, page)
    return { foundImages, totalImages }
  } catch (error) {
    console.log(error)
    return { }
  }
}
