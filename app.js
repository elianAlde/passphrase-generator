function secureRandom(max) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] % max
}


function calculateEntropy(words, size) {
    return words * Math.log2(size)
}


function estimateCrackTime(entropy) {
    const guesses = 2 ** entropy
    const gps = 1e12
    const seconds = guesses / gps
    const years = seconds / (60*60*24*365)

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
    let phrase = []

    for (let i = 0; i < numWords; i++) {
        const index = secureRandom(list.length)
        phrase.push(list[index])
    }

    const passphrase = phrase.join(sep)
    const entropy = calculateEntropy(numWords, list.length)

    document.getElementById("result").textContent = passphrase
    document.getElementById("entropy").textContent = entropy.toFixed(2) + " bits"
    document.getElementById("crack").textContent = estimateCrackTime(entropy)

    const percent = Math.min(entropy, 100)
    const bar = document.getElementById("entropyBar")

    bar.style.width = percent + "%"
}


function copyPassphrase() {
    const text = document.getElementById("result").textContent
    navigator.clipboard.writeText(text)
}