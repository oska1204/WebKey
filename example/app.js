import './web-components.js'

document.querySelector('button').addEventListener('click', function () {
    const elm = this.previousElementSibling
    elm.hasAttribute('dark')
        ? elm.removeAttribute('dark')
        : elm.setAttribute('dark', '')
})
