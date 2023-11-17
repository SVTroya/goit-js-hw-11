import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm"
import "simplelightbox/dist/simple-lightbox.min.css"
import { PixabayAPI } from "./pixabayAPI.js"

export class Gallery {
  #rootSelector
  #lightbox = null
  #api

  constructor(rootSelector) {
    this.#rootSelector = rootSelector
  }

  get rootSelector() {
    return this.#rootSelector
  }

  get api() {
    if (!this.#api){
      this.#api = new PixabayAPI()
    }
    return this.#api
  }

  refreshLightbox() {
    this.#lightbox?.close()
    this.#lightbox = new SimpleLightbox(".gallery a")
  }
}