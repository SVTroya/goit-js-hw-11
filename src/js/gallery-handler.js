//import { smoothScroll } from "./scroll.js"
import InfiniteScroll from "infinite-scroll"
import { NOTIFICATION, showNotification } from "./notifications.js"

function renderImages(rootSelector, galleryItems) {
  const markup = galleryItems.map(getItemHTML)
    .join("")
  rootSelector.insertAdjacentHTML("beforeend", markup)
}

function getItemHTML({
                       tags,
                       likes,
                       views,
                       comments,
                       downloads,
                       webformatURL: smallImg,
                       largeImageURL: largeImg,
                     }) {
  return `<a class="gallery-item" href="${largeImg}">
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
    </a>`
}

export function initInfiniteScroll(gallery) {
  const infScroll = new InfiniteScroll(gallery.rootSelector, {
    path: function() {
      return gallery.api.getUrl(this.pageIndex)
    },
    responseBody: "json",
    status: ".scroll-status",
    history: false,
  })

  infScroll.on("load", (body, path) => {
    console.log(path)
    renderImages(gallery.rootSelector, body.hits)
    const currentPage = infScroll.pageIndex - 1
    /*    if (currentPage > 1) {
          smoothScroll(gallery.rootSelector.firstElementChild.getBoundingClientRect().height * 2)
        }*/
    if ((currentPage * 40) >= body.totalHits && body.hits.length > 0) {
      showNotification(NOTIFICATION.END)
      infScroll.destroy()
    }
    gallery.refreshLightbox()
  })

  return infScroll
}