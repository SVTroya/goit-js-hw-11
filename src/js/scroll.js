export function scrollUp() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function smoothScroll(scrollOn) {
  window.scrollBy({
    top: scrollOn,
    behavior: "smooth",
  })
}
