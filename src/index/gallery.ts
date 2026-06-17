const imageModules = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,gif,svg}', {
	eager: true,
	import: 'default',
}) as Record<string, string>

const galleryImages = Object.entries(imageModules)
	.sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath, undefined, { numeric: true }))
	.map(([, imagePath]) => imagePath)

const prefetchImage = new Image()

export function createGallery(index?: number) {
	if (galleryImages.length === 0) {
		throw new Error('No images were found in src/assets.')
	}

	const resolvedStartIndex = index ?? Math.floor(Math.random() * galleryImages.length)

	let currentIndex = ((resolvedStartIndex % galleryImages.length) + galleryImages.length) % galleryImages.length

	return {
		images: galleryImages,
		getCurrentImage() {
			return galleryImages[currentIndex]
		},
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
