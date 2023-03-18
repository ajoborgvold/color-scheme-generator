const themeToggleBtn = document.getElementById('theme-toggle-btn')
const colorInput = document.getElementById('color-input')
const colorMode = document.getElementById('color-mode')
const colorBtn = document.getElementById('color-btn')
const colorContainer = document.getElementById('color-container')
let isDarkTheme = true


//----- render color scheme when the page loads -----//

function renderInitialColorScheme() {
    fetch('https://www.thecolorapi.com/scheme?hex=5088C3&mode=monochrome')
        .then(res => {
            if (!res.ok){
                throw Error("Color scheme generator currently unavailable")
            }
            return res.json()
        })
        .then(data => {
            data.colors.filter(clr => {
                colorContainer.innerHTML += `
                    <div class="color-scheme color" data-hex="${clr.hex.value}" style="background-image: url(${clr.image.bare})">
                        <div>
                            <p class="hex-code" data-hex="${clr.hex.value}">${clr.hex.value}</p>
                            <span class="hidden highlight" id="${clr.hex.value}">Color code copied!</span>
                        </div>
                    </div>
                `
                    })
                })
        .catch(err => {
            console.error(err)
            colorContainer.innerHTML = `
                <div class="user-error-message" id="user-error-message">
                    <h4>The color scheme generator is currently unavailable.</h4>
                    <h5>Please try again later.</h5>
                </div>
            `
        })
}

renderInitialColorScheme()


//----- toggle app theme -----//

themeToggleBtn.addEventListener('click', toggleAppTheme)

function toggleAppTheme() {
    if (isDarkTheme) {
        isDarkTheme = false
        themeToggleBtn.textContent = "Dark theme"
    }
    else {
        isDarkTheme = true
        themeToggleBtn.textContent = "Light theme"
    }
    
    document.body.classList.toggle('body--light')
    colorMode.classList.toggle('select--light')
    colorBtn.classList.toggle('button--light')
    themeToggleBtn.classList.toggle('button--light')
    
    const errorMessage = document.getElementById('user-error-message')
    if (errorMessage) {
        errorMessage.classList.toggle('user-error-message--light')
    }
    
}


//----- event listeners -----//

colorInput.addEventListener('change', () => colorInput.value)
   
colorMode.addEventListener('change', () => colorMode.value)

colorBtn.addEventListener('click', getColorScheme)

document.addEventListener('click', e => {
    if (e.target.dataset.hex){
        copyHexCode(e.target.dataset.hex)
    }
})


//----- color scheme function -----//

function getColorScheme() {
    colorContainer.textContent = ""
    
    fetch(`https://www.thecolorapi.com/scheme?hex=${colorInput.value.slice(1)}&mode=${colorMode.value}`)
        .then(res => {
            if (!res.ok){
                throw Error("Color scheme generator currently unavailable")
            }
            return res.json()
        })
        .then(data => {
            data.colors.filter(clr => {
                colorContainer.innerHTML += `
                    <div class="color-scheme" data-hex="${clr.hex.value}" style="background-image: url(${clr.image.bare})">
                        <div>
                            <p class="hex-code" data-hex="${clr.hex.value}">${clr.hex.value}</p>
                            <span class="hidden highlight" id="${clr.hex.value}">Color code copied!</span>
                        </div>
                    </div>
                `
            })
        })
        .catch(err => {
            console.error(err)
            colorContainer.innerHTML = `
                <div class="user-error-message" id="user-error-message">
                    <h4>The color scheme generator is currently unavailable.</h4>
                    <h5>Please try again later.</h5>
                </div>
            `
        }) 
}


//----- copy to clipboard function-----//

function copyHexCode(hex) {
//-- To avoid getting an error in the console, I've commented out the two lines of code below because they don't work on Scrimba. When I use VS code to run the code locally, everything works. --//

    // navigator.clipboard.writeText(hex).then(() => console.log('Copying to clipboard was successful!'),
    //     err => console.error('Could not copy text: ', err))

    const colorCodes = document.getElementsByClassName('hex-code')
    for (let code of colorCodes) {
        code.classList.add('hidden')
        setTimeout(() => code.classList.remove('hidden'), 1500)
    }

    const targetColor = document.getElementById(hex)
    targetColor.classList.remove('hidden')
    setTimeout(() => targetColor.classList.add('hidden'), 1500)
}