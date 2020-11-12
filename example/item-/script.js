import WebKey from '/web-key.js'

/*
HTML output:
<div class="wrapper">
    <h1 contenteditable></h1>
</div>

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
        this.elms.wrapper = this.shadowRoot.querySelector('.wrapper')
        this.elms.h1 = this.shadowRoot.querySelector('h1')
        this.setEventListener(this.elms.h1, 'blur', e => {
            this.text = e.target.textContent
        })
    }

    contentRemoved() {
        this.text = 'I got removed ><span style="-webkit-text-fill-color: red;">:</span>('
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
        this.elms.h1.innerHTML = this.text.replace(/./g, e => `<span>${e}</span>`)
    }

    get dark() {
        return this.data.dark
    }

    set dark(value) {
        this.data.dark = value !== null
        return true
    }

    render_dark() {
        this.elms.wrapper.classList.toggle('dark')
        this.render_text()
    }
})
