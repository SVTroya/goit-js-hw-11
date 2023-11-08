import Notiflix from "notiflix"
import axios from "axios"
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm"
import "simplelightbox/dist/simple-lightbox.min.css"

const URL_PIXABAY = "https://pixabay.com/api/"
const KEY_PIXABAY = "40532250-7000c5ca3f9409cc384b0640a"
const IMG_PER_PAGE = 40
const ERR = {
  EMPTY: 0,
  NOT_FOUND: 1,
  END: 2,
}
const NOTIFICATION = {
  END: 0,
  FOUND: 1
}

const els = {
  formEl: document.querySelector("form.search-form"),
  inputSearchEl: document.querySelector("input.input-search"),
  btnSearchEl: document.querySelector("button.btn-search"),
  galleryEl: document.querySelector("div.gallery"),
  btnLoadMoreEl: null,
}

let gallery = null
let page = 1
let query = ""

els.formEl.onsubmit = onSubmit

async function onSubmit(event) {
  event.preventDefault()
  setToDefault()
  const inputValue = event.target.elements.searchQuery.value
  if (!inputValue) {
    showError(ERR.EMPTY)
    return
  }
  query = inputValue.split(" ").join("+")
  await getImages()
  gallery = new SimpleLightbox(".gallery a")
  els.formEl.reset()
}

async function fetchImages() {
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

function showNotification(notificationCode, totalHits) {
  let message = ""
  switch (notificationCode) {
    case 0:
      message = "You've reached the end of search results 😉."
      break
    case 1:
      message = `Hooray! We found ${totalHits} images.`
      break
  }

  Notiflix.Notify.success(message)
}

function renderGallery(galleryItems, hasMore) {
  const markup = galleryItems.map(image =>
    `<a class="gallery-item" href="${image.largeImageURL}">
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
    </a>`)
    .join("")

  els.galleryEl.insertAdjacentHTML("beforeend", markup)

  if(hasMore) {
    addLoadMoreBtn()
  }
  else {
    showNotification(NOTIFICATION.END)
  }
  smoothScroll()
}

function setToDefault() {
  els.galleryEl.innerHTML = ""
  query = ""
  page = 1
  if (els.btnLoadMoreEl) {
    els.btnLoadMoreEl.remove()
  }
}

async function onLoadMoreClicked() {
  els.btnLoadMoreEl.remove()
  page++
  await getImages()
  gallery.refresh()
}

function addLoadMoreBtn() {
  els.btnLoadMoreEl = document.createElement("button")
  els.btnLoadMoreEl.className = "gallery-item"
  els.btnLoadMoreEl.textContent = "Load more"
  els.galleryEl.append(els.btnLoadMoreEl)
  els.btnLoadMoreEl.onclick = onLoadMoreClicked
}

async function getImages() {
  try {
    const galleryItems = await fetchImages()
    if (!galleryItems.hits.length) {
      showError(ERR.NOT_FOUND)
      return
    }
    if (page === 1) {
      showNotification(NOTIFICATION.FOUND, galleryItems.totalHits)
    }
    const hasMore = (galleryItems.totalHits - IMG_PER_PAGE * page) > 0
    renderGallery(galleryItems.hits, hasMore)
  } catch (error) {
    console.log(error)
  }
}

function smoothScroll() {
  const { height: cardHeight } = els.galleryEl.firstElementChild.getBoundingClientRect()
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth"
  })
}