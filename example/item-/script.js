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
        this.text = 'Initial'
    }
    
    contentLoaded() {
        this.elms.wrapper = this.shadowRoot.querySelector('.wrapper')
        this.elms.h1 = this.shadowRoot.querySelector('h1')
        const { h1 } = this.elms
        this.setEventListener(h1, 'blur', e => {
            this.text = e.target.textContent
        })
    }

    contentRemoved() {
        this.text = 'I got removed ><span class="removed">:</span>('
    }

    static get observedAttributes() {
        return ['text', 'dark']
    }

    set_text(value) {
        return value || 'Default'
    }

    render_text() {
        const { h1 } = this.elms
        h1.innerHTML = this.text.replace(/./g, e => `${e}`)
    }

    set_dark(value) {
        return value !== null && value !== false
    }

    render_dark() {
        const { wrapper } = this.elms
        const classList = wrapper.classList
        this.dark ? classList.add('dark') : classList.remove('dark')
        this.render_text()
    }
})
