import './styles/index.css'

class Slider {
	count = null
	current = 0
	node = null
	width = 0
	nodeValue = null
	intervalId = null
	controls = null
	navigation = {
		prev: 0,
		next: 0,
	}

	loopedSlides = false
	delay = 0
	pagination = null
	counter = null
	max = null

	constructor(
		node,
		controlsNode,
		pagination,
		navigation,
		loopedSlides,
		delay,
		counter,
		max
	) {
		if (node) {
			this.node = document.querySelector(node)
			this.count = this.node.children.length
			this.max = max

			if (counter) {
				this.counter = this.nodeValue =
					document.querySelector('.slider__current')
			}

			this.controls = document.querySelector(controlsNode)
			this.navigation.prev = document.querySelector(navigation.prev)
			this.navigation.next = document.querySelector(navigation.next)

			if (pagination) {
				this.pagination = document.querySelector(pagination)
			}

			this.loopedSlides = loopedSlides
			this.delay = delay

			this.init()
			this.addEventListeners()
		}
	}

	destroy() {
		this.node.style.transform = `translateX(0px)`
	}

	init() {
		if (this.loopedSlides) {
			this.intervalId = setInterval(this.loop, this.delay)
		} else {
			this.setDisabled()
		}
	}

	pause = () => {
		if (this.intervalId) {
			clearInterval(this.intervalId)
			this.intervalId = null
		}
	}

	resume = () => {
		if (!this.intervalId && this.loopedSlides) {
			this.intervalId = setInterval(this.loop, this.delay)
		}
	}

	addEventListeners() {
		if (this.controls) {
			this.controls.addEventListener('mouseenter', this.pause)
			this.controls.addEventListener('mouseleave', this.resume)
			this.navigation.prev.addEventListener('click', this.prevSlide)
			this.navigation.next.addEventListener('click', this.nextSlide)
		}
	}

	loop = () => {
		const slideWidth = this.node.scrollWidth / this.count

		if (this.current === 5) {
			this.current = 0
		}

		this.node.style.transform = `translateX(-${this.current * slideWidth}px)`
		this.current = (this.current + 1) % this.count
		this.nodeValue.textContent = this.current
	}

	setDisabled = () => {
		if (!this.loopedSlides) {
			if (this.current < 1) {
				this.navigation.prev.setAttribute('disabled', 'true')
			} else if (this.current === this.max) {
				this.navigation.next.setAttribute('disabled', 'true')
			} else {
				this.navigation.prev.removeAttribute('disabled')
				this.navigation.next.removeAttribute('disabled')
			}
		}
	}

	prevSlide = () => {
		const slideWidth = this.node.scrollWidth / this.count

		if (this.current >= 1) {
			this.current = this.current - 1
		} else if (!this.current && this.loopedSlides) {
			this.current = 5
		}

		this.node.style.transform = `translateX(-${this.current * slideWidth}px)`
		this.setCounter()
		this.setDisabled()
		this.setBullet()
	}

	nextSlide = () => {
		const slideWidth = this.node.scrollWidth / this.count

		if (this.current <= this.max - 1) {
			this.current = this.current + 1
		} else if (this.current === this.max && this.loopedSlides) {
			this.current = 0
		}

		this.node.style.transform = `translateX(-${this.current * slideWidth}px)`
		this.setCounter()
		this.setDisabled()
		this.setBullet()
	}

	setCounter = () => {
		if (this.counter) {
			this.nodeValue.textContent = this.current + 1
		}
	}

	setBullet = () => {
		if (this.pagination) {
			const children = this.pagination.children
			const length = this.pagination.children.length

			for (let i = 0; i < length; i++) {
				if (i === this.current) {
					children[i].classList.add('pagination__bullet-active')
				} else {
					children[i].classList.remove('pagination__bullet-active')
				}
			}
		}
	}
}

let slider1 = null

function initSlider() {
	if (window.innerWidth < 1200 && !slider1) {
		slider1 = new Slider(
			'.adaptive-layout__wrapper',
			'.controls',
			'.pagination',
			{
				prev: '.prev',
				next: '.next',
			},
			false,
			1000,
			false,
			4
		)
	} else if (window.innerWidth >= 1200 && slider1) {
		slider1.destroy()
		slider1 = null
	}
}

const slider2 = new Slider(
	'.slider__wrapper',
	'.slider__controls',
	false,
	{
		prev: '.slider__prev',
		next: '.slider__next',
	},
	true,
	4000,
	true,
	5
)

document.addEventListener('DOMContentLoaded', initSlider)

window.addEventListener('resize', initSlider)
