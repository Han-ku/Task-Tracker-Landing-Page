document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.header_list a')

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault()

            const targetId = this.getAttribute('data-target')
            const targetElement = document.querySelector(targetId)

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' })
            }
        })
    })
})


document.addEventListener('DOMContentLoaded', function () {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn')
    const headerSection = document.querySelector('header')
    const footerSection = document.querySelector('footer')
    const headerSectionHeight = headerSection.offsetHeight
    const footerMargin = 20

    window.addEventListener('scroll', function () {
        const footerTop = footerSection.getBoundingClientRect().top
        const windowHeight = window.innerHeight
        const btnHeight = scrollToTopBtn.offsetHeight

        if (window.scrollY > headerSectionHeight) {
            scrollToTopBtn.classList.add('show')
        } else {
            scrollToTopBtn.classList.remove('show')
        }

        if (footerTop < windowHeight - btnHeight - footerMargin) {
            scrollToTopBtn.style.bottom = `${windowHeight - footerTop + footerMargin}px`
        } else {
            scrollToTopBtn.style.bottom = '2vh'
        }
    })

    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    })
})

document.addEventListener('DOMContentLoaded', function () {
    const burger = document.querySelector('.burger')
    const nav = document.querySelector('nav')
    const navLinks = document.querySelectorAll('nav li')

    burger.addEventListener('click', function() {
        this.classList.toggle('active')
        nav.classList.toggle('open')

        // Toggle body overflow
        if (nav.classList.contains('open')) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    })

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burger.classList.remove('active')
            nav.classList.remove('open')
            document.body.style.overflow = 'auto'
        })
    })
})

document.querySelectorAll('.footer-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault()

        const target = document.querySelector(this.getAttribute('href'))
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' })
        }
    })
})