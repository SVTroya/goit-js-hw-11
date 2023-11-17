import Notiflix from "notiflix"

export const ERR = {
  EMPTY: 0,
  NOT_FOUND: 1,
  END: 2,
}

export const NOTIFICATION = {
  END: 0,
  FOUND: 1
}

export function showError(errorCode) {
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

export function showNotification(notificationCode, totalHits) {
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