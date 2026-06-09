import './index.css'
import { createGallery } from './gallery'

const imageElement = document.querySelector<HTMLImageElement>('#imageGallery img')
const nextButton = document.querySelector<HTMLButtonElement>('#newCupcakeButton')

if (!imageElement || !nextButton) {
  throw new Error('Gallery markup is missing from index.html.')
}

const gallery = createGallery()

imageElement.src = gallery.getCurrentImage()

nextButton.addEventListener('click', () => {
  imageElement.src = gallery.getNextImage()
})
