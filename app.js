const WORDLISTS = {}

async function loadWordlists() {
    const datasets = {
        en: "english-dataset.txt",
        it: "italian-dataset.txt"
    }

    for (const [name, file] of Object.entries(datasets)) {
        const response = await fetch(file)

        if (!response.ok) {
            throw new Error(`Unable to load ${file}`)
        }

        const text = await response.text()

        WORDLISTS[name] = text
            .split(/\r?\n/)
            .map(word => word.trim())
            .filter(word => word.length > 0)
    }

    console.log("Wordlists loaded:", Object.keys(WORDLISTS))
}

function secureRandom(max) {
    const limit = Math.floor(0x100000000 / max) * max
    const array = new Uint32Array(1)

    while (true) {
        crypto.getRandomValues(array)

        if (array[0] < limit) {
            return array[0] % max
        }
    }
}

function calculateEntropy(words, size) {
    return words * Math.log2(size)
}

function estimateCrackTime(entropy) {
    const guesses = 2 ** entropy
    const gps = 1e12
    const seconds = guesses / gps
    const years = seconds / (60 * 60 * 24 * 365)

    if (years < 1)
        return Math.round(seconds) + " seconds"

    if (years < 1000)
        return years.toFixed(2) + " years"

    return years.toExponential(2) + " years"
}

function generate() {
    const numWords = parseInt(document.getElementById("words").value)
    const sep = document.getElementById("separator").value
    const wl = document.getElementById("wordlist").value

    const list = WORDLISTS[wl]

    if (!list || list.length === 0) {
        alert("Wordlist not loaded yet")
        return
    }

    const phrase = []

    for (let i = 0; i < numWords; i++) {
        const index = secureRandom(list.length)
        phrase.push(list[index])
    }

    const passphrase = phrase.join(sep)
    const entropy = calculateEntropy(numWords, list.length)

    document.getElementById("result").textContent = passphrase
    document.getElementById("entropy").textContent =
        entropy.toFixed(2) + " bits"

    document.getElementById("crack").textContent =
        estimateCrackTime(entropy)

    const percent = Math.min(entropy, 100)
    document.getElementById("entropyBar").style.width =
        percent + "%"
}

function copyPassphrase() {
    const text = document.getElementById("result").textContent
    navigator.clipboard.writeText(text)
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadWordlists()
    } catch (err) {
        console.error(err)
        alert("Failed to load wordlists")
    }
})