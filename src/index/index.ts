import './index.css'
import { createGallery } from './gallery'

const imageElement = document.querySelector<HTMLImageElement>('#imageGallery img')
const nextCupcakeButton = document.querySelector<HTMLButtonElement>('#newCupcakeButton')
const copyButton = document.querySelector<HTMLButtonElement>('#copyLinkButton')

if (!imageElement || !nextCupcakeButton || !copyButton) {
  throw new Error('Gallery markup is missing from index.html.')
}

const gallery = createGallery()

imageElement.src = gallery.getCurrentImage()
gallery.prefetchNextImage()

nextCupcakeButton.addEventListener('click', () => {
  imageElement.src = gallery.getNextImage()
  gallery.prefetchNextImage()
})

copyButton.addEventListener('click', () => {
  const imageUrl = new URL(imageElement.src, window.location.href).href
  navigator.clipboard.writeText(imageUrl)
  copyButton.textContent = "Link Copied!"
})
