customElements.define('template-', class extends WebKey {
    constructor() {
        super('blank')
        this.elms = {}
    }
    
    contentLoaded() {
    }

    contentRemoved() {
    }

    static get observedAttributes() {
        return ['blank']
    }

    render_blank() {
    }
})
