import axios from "axios"

export class PixabayAPI {
  static BASE_URL = "https://pixabay.com"
  static ACCESS_KEY = "40532250-7000c5ca3f9409cc384b0640a"
  static IMG_PER_PAGE = 40

  #query = ''

  constructor() {
    axios.defaults.baseURL = PixabayAPI.BASE_URL
  }

  getUrl(page) {
    const endPoint = "/api/"
    const params = new URLSearchParams({
      key: PixabayAPI.ACCESS_KEY,
      q: this.query,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      per_page: PixabayAPI.IMG_PER_PAGE,
      page: page,
    })
    return `${PixabayAPI.BASE_URL}${endPoint}?${params}`
  }

  set query(query) {
    this.#query =  query
  }

  get query() {
    return this.#query
  }
}

