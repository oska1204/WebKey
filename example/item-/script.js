import WebKey from '../../web-key.js'

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
        super('text', 'dark')
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
        this.text = 'I got removed ><span class="removed">:</span>('
    }

    static get observedAttributes() {
        return ['text', 'dark']
    }

    get_text(value) {
        return value
    }

    set_text(value) {
        return value || 'Default'
    }

    render_text() {
        this.elms.h1.innerHTML = this.text.replace(/./g, e => `${e}`)
    }

    get_dark(value) {
        return value
    }

    set_dark(value) {
        return value !== null
    }

    render_dark() {
        const classList = this.elms.wrapper.classList
        this.dark ? classList.add('dark') : classList.remove('dark')
        this.render_text()
    }
})
