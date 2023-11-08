import { ERR, showError } from "./notifications.js"
import { formEl, galleryEl } from "./refs.js"
import { initGallery, Gallery } from "./gallery.js"

formEl.onsubmit = onSubmit

async function onSubmit(event) {
  event.preventDefault()
  clearGallery()
  const inputValue = event.target.elements.searchQuery.value
  if (!inputValue) {
    showError(ERR.EMPTY)
    return
  }
  const gallery = new Gallery(galleryEl,inputValue.split(" ").join("+"))
  await initGallery(gallery)
  formEl.reset()
}

function clearGallery() {
  galleryEl.innerHTML = ""
}

window.addEventListener('scroll', () => {
  console.log("scrolled")
})