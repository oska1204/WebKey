{
const getPath = () => {
    return new Error()
        .stack
        .toString()
        .match(/https?:\/\/.*\.js/g)
        .filter(e => !e.match(/\/web-key\.js/))[0]
        .replace(/(?!.*\/).*/, '')
}

const templates = {}

const init = async elm => {
    const path = getPath()
    if (!templates[path]) {
        templates[path] = document.createElement('template')
        templates[path].isFetched = 0
    }
    elm.attachShadow({ mode: 'open' })
    const initContent = () => {
        elm.shadowRoot.appendChild(templates[path].content.cloneNode(true))
        elm.isContentLoaded = true
        elm.dispatchEvent(new CustomEvent('content-loaded'))
        elm.removeEventListener('fetched', initContent)
        elm.removeEventListener('content-loaded', elm.initContent)
    }
    if (templates[path].isFetched === 0) {
        templates[path].isFetched = 1
        templates[path].innerHTML += `<link rel="stylesheet" href="${path}style.css">`
        templates[path].innerHTML += await fetch(`${path}template.html`)
            .then(e => e.text())
        templates[path].isFetched = 2
        templates[path].dispatchEvent(new CustomEvent('fetched'))
    }
    if (templates[path].isFetched === 1) {
        templates[path].addEventListener('fetched', initContent)
    }
    if (templates[path].isFetched === 2) {
        initContent()
    }
}

window.WebKey = class WebKey extends HTMLElement {
    constructor() {
        super()
        this.isContentLoaded = false
        this._obj = {}
        this._data = new Proxy(this._obj, {
            set: (obj, prop, value) => {
                obj[prop] = value
                this.renderProp(prop, value)
                return true
            }
        })
        this.addEventListener('content-loaded', this.initContent)
        init(this)
    }

    static get observedAttributes() {
        return []
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue
    }

    initContent() {
        if (typeof this.contentLoaded === 'function')
            this.contentLoaded()
        this.updateUI()
    }

    updateUI() {
        for (const prop in this.data) {
            if (this.data.hasOwnProperty(prop)) {
                const value = this.data[prop]
                this.renderProp(prop, value)
            }
        }
    }

    get data() {
        return this._data
    }

    set data(obj) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                const value = obj[prop]
                this.data[prop] = value
            }
        }
    }

    renderProp(prop, value) {
        if (this.isContentLoaded && typeof this[this.getRenderName(prop)] === 'function')
            this[this.getRenderName(prop)](value)
    }

    getRenderName(prop) {
        return `render_${prop}`
    }

    isFontFamilySet(node) {
        return node.computedStyleMap().get('font-family').toString() !== this.initialFont(node)
    }

    initialFont(node) {
        const template = document.createElement('template')
        template.style.cssText = 'font-family: initial !important'
        node.append(template)
        const initial = template.computedStyleMap().get('font-family').toString()
        template.remove()
        return initial
    }
}
}