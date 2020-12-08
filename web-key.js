// See "template-" folder for template
export default (() => {
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
        elm.dirname = path
        const initContent = async () => {
            await elm.shadowRoot.appendChild(templates[path].content.cloneNode(true))
            elm.removeEventListener('fetched', initContent)
            elm.isContentLoaded = true
            elm.dispatchEvent(new CustomEvent('content-loaded'))
            elm.updateFrontEnd()
        }
        if (!templates[path]) {
            templates[path] = document.createElement('template')
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
        constructor(...props) {
            super()
            this.defaultProps(...props)
            this.attachShadow({ mode: 'open' })
            this.query = this.shadowRoot.querySelector.bind(this.shadowRoot)
            this.queryAll = this.shadowRoot.querySelectorAll.bind(this.shadowRoot)
            this.addEventListener('content-loaded', this.contentLoaded)
            init(this)
        }

        isContentLoaded = false
        elms = {}
        _eventListeners = []
        _obj = {}
        _data = new Proxy(this._obj, {
            set: (obj, prop, value) => {
                obj[prop] = value
                this.renderProp(prop)
                return true
            }
        })

        addElms = (obj) => {
            Object.assign(this.elms, obj)
        }

        defaultProps = (...props) => {
            props.forEach(prop => {
                Object.defineProperty(this, prop, {
                    get: () => {
                        const name = `get_${prop}`
                        if (typeof this[name] === 'function')
                            return this[name](this.data[prop])
                        return this.data[prop]
                    },
                    set: (value) => {
                        const name = `set_${prop}`
                        if (typeof this[name] === 'function')
                            this.data[prop] = this[name](value)
                        else
                            this.data[prop] = value
                        return true
                    },
                    enumerable: true,
                    configurable: true
                })
            })
        }

        connectedCallback() {
            if (this.isContentLoaded) {
                this.contentLoaded()
                this.updateFrontEnd()
            }
        }

        disconnectedCallback() {
            this.disconnectEventListeners()
            this.contentRemoved()
        }

        static get observedAttributes() {
            return []
        }

        attributeChangedCallback(name, oldValue, newValue) {
            this[name] = newValue
        }

        contentLoaded() {
        }

        contentRemoved() {
        }

        updateFrontEnd = () => {
            for (const prop in this.data) {
                if (this.data.hasOwnProperty(prop)) {
                    this.renderProp(prop)
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

        renderProp = (prop) => {
            if (this.isContentLoaded && typeof this[this.getRenderName(prop)] === 'function')
                this[this.getRenderName(prop)]()
        }

        getRenderName = (prop) => {
            return `render_${prop}`
        }

        isFontFamilySet = (node) => {
            return node.computedStyleMap().get('font-family').toString() !== this.initialFont(node)
        }

        initialFont = (node) => {
            const template = document.createElement('template')
            template.style.cssText = 'font-family: initial !important'
            node.append(template)
            const initial = template.computedStyleMap().get('font-family').toString()
            template.remove()
            return initial
        }

        setEventListener = (target, type, listener) => {
            target.addEventListener(type, listener)
            this._eventListeners.push({ target, type, listener })
        }

        disconnectEventListeners = () => {
            this._eventListeners.forEach(obj => {
                const { target, type, listener } = obj
                target.removeEventListener(type, listener)
            })
        }
    }

    return WebKey
})()
