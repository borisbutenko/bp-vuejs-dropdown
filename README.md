# bp-vuejs-dropdown

[Documentation and demo](https://brandquad.github.io/bp-vuejs-demo/#/dropdown)

Install:
```bash
npm i -D bp-vuejs-dropdown
```

```bash
import Vue from 'vue';
import Dropdown from 'bp-vuejs-dropdown';
```

```bash
// global
Vue.use(Dropdown)
```

```bash
// local
components: { Dropdown }
```

Use:
```vue
<dropdown>
    <template slot="btn">Custom btn</template>
    <template slot="icon">Custom icon</template>
    <template slot="body">Custom body</template>
</dropdown>
```