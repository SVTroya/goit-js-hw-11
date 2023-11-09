import { ERR, NOTIFICATION, showError, showNotification } from "./notifications.js"
import { formEl, galleryEl, btnScrollUpEl } from "./refs.js"
import { initGallery, Gallery } from "./gallery.js"
import { scrollUp } from "./scroll.js"
import throttle from "lodash/throttle"


formEl.onsubmit = onSubmit

async function onSubmit(event) {
  event.preventDefault()
  clearGallery()
  const inputValue = event.target.elements.searchQuery.value
  if (!inputValue) {
    showError(ERR.EMPTY)
    return
  }
  const gallery = new Gallery(galleryEl, inputValue.split(" ").join("+"))
  await initGallery(gallery)
  gallery.totalImages
    ? showNotification(NOTIFICATION.FOUND, gallery.totalImages)
    : showError(ERR.NOT_FOUND)
  formEl.reset()
}

function clearGallery() {
  galleryEl.innerHTML = ""
}

document.addEventListener("scroll", throttle(() => {
  if (window.scrollY < 900 && btnScrollUpEl.style.transform !== "scale(0)") {
    btnScrollUpEl.style.transform = "scale(0)"
  }
  if (window.scrollY > 900 && btnScrollUpEl.style.transform !== "scale(1)") {
    btnScrollUpEl.style.transform = "scale(1)"
  }
}, 200))

btnScrollUpEl.onclick = () => {
  scrollUp()
}
