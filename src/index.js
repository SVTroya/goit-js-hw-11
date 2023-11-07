import Notiflix from "notiflix"
import axios from "axios"
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm"
import "simplelightbox/dist/simple-lightbox.min.css"

const URL_PIXABAY = "https://pixabay.com/api/"
const KEY_PIXABAY = "40532250-7000c5ca3f9409cc384b0640a"
const ERR = {
  EMPTY: 0,
  NOT_FOUND: 1,
  END: 2,
}

const els = {
  formEl: document.querySelector("form.search-form"),
  inputSearchEl: document.querySelector("input.input-search"),
  btnSearchEl: document.querySelector("button.btn-search"),
  galleryEl: document.querySelector("div.gallery"),
}

const gallery = new SimpleLightbox('.gallery a')

/*els.galleryEl.onclick = (event) => {
  event.preventDefault()
}*/

els.formEl.onsubmit = async (event) => {
  event.preventDefault()
  const inputValue = event.target.elements.searchQuery.value
  if (!inputValue) {
    showError(ERR.EMPTY)
    return
  }
  const query = inputValue.split(" ").join("+")
  try {
    const galleryItems = await fetchImages(query)
    if (!galleryItems.hits.length) {
      showError(ERR.NOT_FOUND)
      return
    }
    renderGallery(galleryItems.hits)
    gallery.refresh()
    els.formEl.reset()
  } catch (error) {
    console.log(error)
    showError(ERR.NOT_FOUND)
  }
}

async function fetchImages(query) {
  const params = new URLSearchParams({
    key: KEY_PIXABAY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
  })

  const response = await axios.get(`${URL_PIXABAY}?${params}`)
  return response.data
}

function showError(errorCode) {
  let message = ""
  switch (errorCode) {
    case 0:
      message = "Sorry, query can't be empty. Please enter search query."
      break
    case 1:
      message = "Sorry, there are no images matching your search query. Please try again."
      break
    case 2:
      message = "We're sorry, but you've reached the end of search results."
      break
  }

  Notiflix.Notify.failure(message)
}

function renderGallery(galleryItems) {
  const markup = galleryItems.map(image =>
    `<div class="photo-card">
    <a class="gallery-item" href="${image.largeImageURL}">
      <img class="photo-card" src="${image.webformatURL}" alt="${image.tags}"  loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${image.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${image.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${image.downloads}
        </p>
      </div>
    </a>
  </div>`)
    .join("")

  els.galleryEl.insertAdjacentHTML("beforeend", markup)
}