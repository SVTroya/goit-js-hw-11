import { ERR, NOTIFICATION, showError, showNotification } from "./notifications.js"
import { formEl, galleryEl, btnScrollUpEl } from "./refs.js"
import { scrollUp } from "./scroll.js"
import throttle from "lodash/throttle"
import { initInfiniteScroll } from "./gallery-handler.js"
import {Gallery} from "./gallery"

let gallery = null
let infScroll = null

formEl.onsubmit = onSubmit
document.onscroll = throttle(manageUpBtn, 200)
btnScrollUpEl.onclick = scrollUp

function manageUpBtn() {
  if (window.scrollY < 900 && btnScrollUpEl.style.transform !== "scale(0)") {
    btnScrollUpEl.style.transform = "scale(0)"
  }
  if (window.scrollY > 900 && btnScrollUpEl.style.transform !== "scale(1)") {
    btnScrollUpEl.style.transform = "scale(1)"
  }
}

function onSubmit(event) {
  event.preventDefault()
  clearGallery()
  const query = event.target.elements.searchQuery.value.trim()
  event.target.reset()

  if (!query) {
    showError(ERR.EMPTY)
    if (!gallery) {
      gallery.api.query = ""
    }
    return
  }

  getGallery().api.query = query

  infScroll?.destroy()
  infScroll = initInfiniteScroll(getGallery())
  infScroll.loadNextPage()
    .then(({ body: {totalHits} }) => {
      if (!totalHits) {
        showError(ERR.NOT_FOUND)
        return
      }
      showNotification(NOTIFICATION.FOUND, totalHits)
    })
}

function clearGallery() {
  galleryEl.innerHTML = ""
}

function getGallery() {
  if (!gallery) {
    gallery = new Gallery(galleryEl)
  }
  return gallery
}


