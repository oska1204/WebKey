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
        const {
            addElms,
            query,
        } = this
        addElms({
            wrapper: query('.wrapper'),
            h1: query('h1'),
        })
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
        h1.innerHTML = this.text
    }

    set_dark(value) {
        return value !== null
            && value !== false
    }

    render_dark() {
        const { dark } = this
        const { wrapper } = this.elms
        const { classList } = wrapper
        dark
            ? classList.add('dark')
            : classList.remove('dark')
    }
})
