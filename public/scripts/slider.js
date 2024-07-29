const wrapper = document.querySelector(".wrapper")
const carousel = document.querySelector(".carousel")
// const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper .testimonials_arrows")
const carouselChildrens = [...carousel.children]

const hidden_wrapper = document.querySelector(".hidden_wrapper")
console.log(carouselChildrens.length)

const toastOverlay = document.getElementById('toastCommentOverlay')
const fullComment = document.getElementById('fullComment')
const toastDate = document.getElementById('toastDate')
const toastImage = document.getElementById('toastImage')
const toastName = document.getElementById('toastName')
const closeBtn = document.getElementById('closeCommentBtn')

const showCommentToast = (date, imgSrc, name, comment) => {
    toastDate.textContent = date
    toastImage.src = imgSrc
    toastName.textContent = name
    fullComment.textContent = comment
    toastOverlay.classList.add('show', 'visible')
    document.body.classList.add('no-scroll')
    scrollToTopBtn.style.display = 'none'
}


const hideCommentToast = () => {
    toastOverlay.classList.remove('show', 'visible')
    document.body.classList.remove('no-scroll')
    scrollToTopBtn.style.display = 'flex'
}

closeBtn.addEventListener('click', hideCommentToast)

toastOverlay.addEventListener('click', function(event) {
    if (event.target === toastOverlay) {
        hideCommentToast()
    }
})

if (carouselChildrens.length === 0) {
    console.log("There are no cards to display in the carousel")

    carousel.classList.add("hidden")
    arrowBtns.forEach(btn => btn.classList.add("hidden"))
    hidden_wrapper.classList.remove("hidden")
} else {
    carousel.classList.remove("hidden")
    arrowBtns.forEach(btn => btn.classList.remove("hidden"))
    hidden_wrapper.classList.add("hidden")

    const firstCardWidth = carousel.querySelector(".card").offsetWidth

    let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId

 
    let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth)

  
    if (carouselChildrens.length <= cardPerView) {
        isAutoPlay = false
        arrowBtns.forEach(btn => btn.classList.add("hidden"))
    } else {
        carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
            carousel.insertAdjacentHTML("afterbegin", card.outerHTML)
        })

        carouselChildrens.slice(0, cardPerView).forEach(card => {
            carousel.insertAdjacentHTML("beforeend", card.outerHTML)
        })

        carousel.classList.add("no-transition")
        carousel.scrollLeft = carousel.offsetWidth
        carousel.classList.remove("no-transition")
    }

    arrowBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth
        })
    })

    const dragStart = (e) => {
        isDragging = true
        carousel.classList.add("dragging")

        startX = e.pageX
        startScrollLeft = carousel.scrollLeft
    }

    const dragging = (e) => {
        if (!isDragging) return
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX)
    }

    const dragStop = () => {
        isDragging = false
        carousel.classList.remove("dragging")
    }

    const infiniteScroll = () => {
        if (carousel.scrollLeft === 0) {
            carousel.classList.add("no-transition")
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth)
            carousel.classList.remove("no-transition")
        } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
            carousel.classList.add("no-transition")
            carousel.scrollLeft = carousel.offsetWidth
            carousel.classList.remove("no-transition")
        }

        clearTimeout(timeoutId)
        if (!wrapper.matches(":hover")) autoPlay()
    }

    const autoPlay = () => {
        if (window.innerWidth < 800 || !isAutoPlay) return

        timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500)
    }

    autoPlay();

    carousel.addEventListener("mousedown", dragStart)
    carousel.addEventListener("mousemove", dragging)
    document.addEventListener("mouseup", dragStop)
    carousel.addEventListener("scroll", infiniteScroll)
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId))
    wrapper.addEventListener("mouseleave", autoPlay)
}

document.querySelectorAll('.see-more-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.card')
        if (!card) {
            console.error('Card not found')
            return
        }

        const dateElement = card.querySelector('p')
        const imgElement = card.querySelector('img')
        const nameElement = card.querySelector('h2')
        const fullComment = this.dataset.fullComment

        if (!dateElement) {
            console.error('Date element not found')
        }
        if (!imgElement) {
            console.error('Image element not found')
        }
        if (!nameElement) {
            console.error('Name element not found')
        }
        if (!dateElement || !imgElement || !nameElement) {
            console.error('One or more elements not found in the card')
            return;
        }

        const date = dateElement.textContent
        const imgSrc = imgElement.src
        const name = nameElement.textContent
        
        showCommentToast(date, imgSrc, name, fullComment)
    });
});