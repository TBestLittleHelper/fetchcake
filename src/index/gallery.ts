const galleryImages = [
	"/cupcake/01.webp",
	"/cupcake/01vert.png",
	"/cupcake/03.jpg",
	"/cupcake/04.jpg"
]
// todo maybe script this in a prebuild script or vite plugin

const prefetchImage = new Image()

export function createGallery(index?: number) {
	if (galleryImages.length === 0) {
		throw new Error('No images were found in src/assets.')
	}

	const resolvedStartIndex = index ?? Math.floor(Math.random() * galleryImages.length)

	let currentIndex = ((resolvedStartIndex % galleryImages.length) + galleryImages.length) % galleryImages.length

	return {
		images: galleryImages,
		getNextImage() {
			currentIndex = (currentIndex + 1) % galleryImages.length
			return galleryImages[currentIndex]
		},
		prefetchNextImage() {
			const nextIndex = (currentIndex + 1) % galleryImages.length
			prefetchImage.src = galleryImages[nextIndex]

			return galleryImages[nextIndex]
		}
	}
}
