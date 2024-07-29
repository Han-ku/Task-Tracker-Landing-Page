const API_URL = 'https://type.fit/api/quotes'

const BTN = document.querySelector(".btn_change_quote")
const QUOTE = document.querySelector(".quote")
const AUTHOR = document.querySelector(".author")

let previousNum
let quotesData = []
let intervalId

const getAPI = (url) => {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            quotesData = data
            displayQuote(getRandomQuote(data))
            startAutoChange()
        })
}

const getRandomQuote = (data) => {
    const randomInt = getRandomInt(data.length)
    return data[randomInt]
}

const getRandomInt = (length) => {
    let num = Math.floor(Math.random() * length)
    while (num === previousNum) {
        num = Math.floor(Math.random() * length)
    }
    previousNum = num
    return num
}

const displayQuote = (quote) => {
    QUOTE.textContent = quote.text
    AUTHOR.textContent = getAuthor(quote)
}

const getAuthor = (quote) => {
    return quote.author && quote.author !== "type.fit" ? quote.author.split(",")[0] : "Unknown"
}

const startAutoChange = () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(() => {
        displayQuote(getRandomQuote(quotesData))
    }, 10000);
}

BTN.addEventListener("click", () => {
    displayQuote(getRandomQuote(quotesData))
    startAutoChange(); // Сброс таймера при клике
})

window.addEventListener("load", () => {
    getAPI(API_URL)
})