# WebKey
This project aims to make vanilla web components more easy and understandable.

It seperates the HTML/CSS/JS, making it easier for people to understand the code, coming from the outside.

## Installation
There's two ways you can us web-key. You can use ESModules or a script tag.
```js
import WebKey from 'web-key.js'
```
```html
<script src="web-key.js" type="module">
```
Both of them adds it to `window.WebKey`
But with ESModules you have the ability to rename it to something else. (WebKeyV1)

## Initialization
### Component
I recommend you look at the "template-" and "example" folder.

Make a folder with the same name as the component name.
Web Components must have "-" in their name, so you could call it "name-".

Create these basic files:
- template.html
- style.css
- script.js

template.html
```html
<h1>HTML code</h1>
```
style
```css
h1 {
    color: red;
}
```
script.js
```js
customElement.define('component-name', class extends WebKey {
    constructor() {
        super()
    }
    contentLoaded() {
        const { 
            addElms,
            query,
        } = this
        addElms({
            h1: query('h1')
        })
        const { h1 } = this.elms
        console.log(h1) // Access to h1
    }
})
```

### Usecase
You can import the component in js like this `import 'path/to/component-name/script.js'` or in html `<script src="path/to/component-name/script.js">`

If you need to add alot of components look at "generate.js".  
The file is only made for convenience.  
Meaning you could manually add the import for the web-components. But this does it automatically.

Generates "path/to/import.js" that links to all the web-components in the "path/to/web-components" folder.

If you have node installed, open the console and run this: `node generate`.

### Output
```html
<component-name>
    #shadow-root (open)
        <link rel="stylesheet" href="path/to/style.css">
        <h1>HTML code</h1>
</component-name>
```


## WebKey features

### Props
Uses data variable to store data.

#### data
Where the data is stored

#### isContentLoaded
Check if content is loaded

#### elms
Store your dom elements here.

#### dirname
The path to where the web components is located. Usefull if you have an image in the folder you need to link to.

### Functions

#### super(...props)
Must always be called.  
defaultProps() gets called with the super arguments.

#### defaultProps(...props)
In the constructor, pass in the props you want to create getters and setters for.

Each prop then gets functions that called when something is get or set.
- get_prop(value)
- set_prop(value)

The value you return, is what the getter and setter responds with.

#### contentLoaded()
Gets called when content is loaded, and after connectedCallback().

#### contentRemoved()
Gets called when content is removed, and after disconnectedCallback().

#### static get observedAttributes()
Deafault web component function.

Return the attributes you would like to watch in an array.  
The value then gets set to the same name as the prop.  
You must add the attribute name to the defaultProps().

#### setEventListener(target, type, listener)
Use this instead of `target.addEventListener(type, listener)` to get the event listener removed, when the web component gets removed.

#### renderProp(prop)
Calls the function to update the front-end for that prop.

#### query
The same as shadowRoot.querySelector

#### queryAll
The same as shadowRoot.querySelectorAll

#### addElms(obj)
It's uses Object.assign() to add it to elms.

## License
[MIT](https://choosealicense.com/licenses/mit/)
