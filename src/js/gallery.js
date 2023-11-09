import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm"
import "simplelightbox/dist/simple-lightbox.min.css"
import { ERR, NOTIFICATION, showError, showNotification } from "./notifications.js"
import { getImagesByPage, IMG_PER_PAGE } from "./pixabay.js"

export async function initGallery(gallery) {
  const requestResult = await getImagesByPage(gallery.query, gallery.numOfLoadedPage)
  if (!requestResult.totalImages) {
    showError(ERR.NOT_FOUND)
    return
  }
  gallery.totalImages = requestResult.totalImages
  renderGallery(gallery, requestResult.foundImages)
  if (!gallery.hesMore()) {
    showNotification(NOTIFICATION.END)
  }
  gallery.initLightbox()

  return gallery
}

function renderGallery(gallery, galleryItems) {
  createMarkup(gallery.galleryEl, galleryItems)
  if (gallery.hesMore()) {
    addLoadMoreBtn(gallery)
  }
}

function createMarkup(rootSelector, galleryItems) {
  const markup = galleryItems.map(({
                                     tags,
                                     likes,
                                     views,
                                     comments,
                                     downloads,
                                     webformatURL: smallImg,
                                     largeImageURL: largeImg,
                                   }) =>
    `<a class="gallery-item" href="${largeImg}">
      <img class="photo-card" src="${smallImg}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
    </a>`)
    .join("")

  rootSelector.insertAdjacentHTML("beforeend", markup)
}

function addLoadMoreBtn(gallery) {
  const btnLoadMoreEl = document.createElement("button")
  btnLoadMoreEl.className = "gallery-item"
  btnLoadMoreEl.textContent = "Load more"
  gallery.galleryEl.append(btnLoadMoreEl)
  btnLoadMoreEl.onclick = async ({ target }) => {
    await showMore(gallery)
    target.remove()
  }
}

function smoothScroll(scrollOn) {
  window.scrollBy({
    top: scrollOn,
    behavior: "smooth",
  })
}

async function showMore(gallery) {
  gallery.nextPage()
  const requestResult = await getImagesByPage(gallery.query,gallery.numOfLoadedPage)
  renderGallery(gallery, requestResult.foundImages)
  if (!gallery.hesMore()) {
    showNotification(NOTIFICATION.END)
  }
  gallery.refreshGallery()
  smoothScroll(gallery.galleryEl.firstElementChild.getBoundingClientRect().height * 2)
}

export class Gallery {
  #numOfLoadedPage = 1
  #totalImages = 0
  #lightbox = null

  constructor(galleryEl, query) {
    this.galleryEl = galleryEl
    this.query = query
  }

  hesMore() {
    return (Math.ceil(this.#totalImages / IMG_PER_PAGE) - this.#numOfLoadedPage) > 0
  }

  get numOfLoadedPage() {
    return this.#numOfLoadedPage
  }

  nextPage() {
    this.#numOfLoadedPage++
  }


  initLightbox() {
    this.#lightbox = new SimpleLightbox(".gallery a")
  }

  refreshGallery() {
    this.#lightbox?.close()
    this.initLightbox()
  }

  set totalImages(totalImages) {
    this.#totalImages = totalImages
  }
}

