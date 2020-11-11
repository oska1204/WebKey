/*
HTML output:
<h1 contenteditable></h1>

Data input:
- text
- dark

Data output:
- text
- dark

CSS variables:
- --dark-background
- --light-background
*/

customElements.define('item-', class extends WebKey {
    constructor() {
        super()
        this.elms = {}
        this.text = 'Initial'
    }
    
    contentLoaded() {
        this.elms.h1 = this.shadowRoot.querySelector('h1')
        this.elms.h1.addEventListener('blur', e => {
            this.text = e.target.textContent
        })
    }

    static get observedAttributes() {
        return ['text', 'dark']
    }

    get text() {
        return this.data.text
    }

    set text(value) {
        this.data.text = value || 'Default'
        return true
    }

    render_text() {
        this.elms.h1.innerHTML = this.text.replace(/./g, (e, i, str) => {
            const hue = (240 + (i / str.length) * 30).toFixed(2)
            const light = this.dark ? 55 : 25
            return `<span style="color:hsl(${hue}deg 50% ${light}%);">${e}</span>`
        })
    }

    get dark() {
        return this.data.dark
    }

    set dark(value) {
        this.data.dark = value !== null
        return true
    }

    render_dark() {
        this.style.background = this.dark ? 'var(--dark-background, var(--default-dark-background))' : ''
        this.render_text()
    }
})
