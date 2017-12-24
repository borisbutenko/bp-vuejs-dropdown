### bp-vuejs-dropdown

[Live demo here](https://borisbutenko.github.io/bp-vuejs-dropdown/demo/index.html)

Install:
```bash
npm i -D bp-vuejs-dropdown
```
Import:
```javascript
import Vue from 'vue';
import Dropdown from 'bp-vuejs-dropdown/Dropdown';

// global
Vue.use(Dropdown)

//local
components: { Dropdown }
```
Use:
```vue
<dropdown>
    <template slot="btn">
        Custom text 
        // or
        <span>Custom html</span>
    </template>
    <template slot="body">
        Custom text 
        // or
        <ul>
            <li>item 1</li>
            <li>item 2</li>
            <li>item 3</li>
        </ul>
    </template>
</dropdown>
```
### Props
```javascript
props: {
    // --- custom callback before dropdown's open
    // --- :beforeOpen="beforeOpen"
    beforeOpen: {
        type: Funciton,
        required: false,
        default: resolve => resolve()
    },

    // --- trigger on open
    // --- :trigger="'hover'"
    trigger: {
        type: Boolean,
        required: false,
        default: 'click'
    },
    
    // --- close on dropdown body click
    // --- :close-on-click="true"
    closeOnClick: {
        type: Boolean,
        required: false,
        default: false
    },
    
    // --- show dropdown arrow
    // --- :is-arrow="false"
    isArrow: {
        type: Boolean,
        required: false,
        default: true
    },
    
    // --- custom class name
    // --- :class-name="'class'"
    // --- output: 
    //     btn -> .class-bp__btn 
    //     body -> .class-bp__body
    className: {
        type: String,
        required: false,
        default: ''
    }
}
```
### Positioning

Dropdown has auto positioning, depending on position in visible field (window)