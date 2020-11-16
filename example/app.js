import '/example/item-/script.js'

document.querySelector('button').addEventListener('click', function () {
    const elm = this.previousElementSibling
    elm.hasAttribute('dark') ? elm.removeAttribute('dark') : elm.setAttribute('dark', '')
})
