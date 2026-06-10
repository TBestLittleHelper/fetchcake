import './index.css'
import { createGallery } from './gallery'

const imageElement = document.querySelector<HTMLImageElement>('#imageGallery img')
const nextButton = document.querySelector<HTMLButtonElement>('#newCupcakeButton')
const copyButton = document.querySelector<HTMLButtonElement>('#copyLinkButton')

if (!imageElement || !nextButton || !copyButton) {
  throw new Error('Gallery markup is missing from index.html.')
}

const gallery = createGallery()

imageElement.src = gallery.getCurrentImage()

nextButton.addEventListener('click', () => {
  imageElement.src = gallery.getNextImage()
})

copyButton.addEventListener('click', () => {
  const imageUrl = new URL(imageElement.src, window.location.href).href
  navigator.clipboard.writeText(imageUrl)
  copyButton.textContent = "Link Copied!"
})
