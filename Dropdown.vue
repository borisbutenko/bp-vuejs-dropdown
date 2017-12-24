<template>
    <div class="bp-dropdown" :class="className">
        <span @click="_onToggle"
              @mouseenter="_onMouseenter"
              @mouseleave="_onMouseleave"
              :class="btnClassObject"
              class="bp-dropdown__btn">
            <slot name="btn">Button text</slot>
            <svg v-if="isArrow"
                 class="bp-dropdown__icon"
                 viewBox="0 0 256 512">
                <path fill="currentColor" d="M119.5 326.9L3.5 209.1c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0L128 287.3l100.4-102.2c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L136.5 327c-4.7 4.6-12.3 4.6-17-.1z"></path>
            </svg>
        </span>
        <transition name="fade">
            <div v-if="!isHidden"
                 @click="_onBodyClick"
                 @mouseleave="_onMouseleave"
                 :id="generatedId"
                 :style="{ top: `${positionTop}px`, left: `${positionLeft}px` }"
                 :class="`bp-dropdown__body ${className}-bp__body`">
                <slot name="body">Empty content</slot>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'bp-vuejs-dropdown',

        props: {
            beforeOpen: {
                type: Function,
                required: false,
                default: resolve => resolve()
            },

            trigger: {
                type: String,
                required: false,
                default: 'click'
            },

            closeOnClick: {
                type: Boolean,
                required: false,
                default: false
            },

            isArrow: {
                type: Boolean,
                required: false,
                default: true
            },

            className: {
                type: String,
                required: false,
                default: ''
            },
        },

        data() {
            return {
                isHidden: true,
                isAppended: false,
                generatedId: undefined,
                positionTop: undefined,
                positionLeft: undefined
            }
        },

        computed: {
            btnClassObject() {
                let obj = { 'bp-dropdown__btn--active': !this.isHidden };

                if (this.className) {
                    obj[`${this.className}-bp__btn`] = true;
                }

                return obj;
            }
        },

        created() {
            const $root = this.$root;

            // --- hide dropdown on show other dropdowns
            $root.$on('bq-dropdown:hide', () => this.isHidden = true);

            // --- hide dropdown on document click event
            if (this.trigger === 'click' && !$root.bqDropdown) {
                $root.bqDropdown = true;

                document.onclick = (e) => {
                    let target = e.target;
                    let dropdown = target.closest('.bp-dropdown__btn') || target.closest('.bp-dropdown__body');

                    if (dropdown) {
                        return;
                    }

                    this.$root.$emit('bq-dropdown:hide');
                }
            }

            this.generateRandomId();
        },

        methods: {
            // --- generate random id for dropdown body position
            generateRandomId() {
                this.generatedId = `bq-dropdown-${Math.random().toString(36).substr(2, 10)}`;
            },

            _onToggle() {
                if (this.trigger !== 'click') {
                    return;
                }

                this.checkCustomCallback();
            },

            _onMouseenter() {
                if (this.trigger !== 'hover' || !this.isHidden) {
                    return;
                }

                this.checkCustomCallback();
            },

            _onMouseleave(e) {
                if (this.trigger !== 'hover') {
                    return;
                }

                let toElement = e.toElement;
                if (!toElement) {
                    return;
                }

                let isDropdown = toElement.closest('.bp-dropdown__btn') || toElement.closest('.bp-dropdown__body');
                if (isDropdown) {
                    return;
                }

                this.prepare();
            },

            _onBodyClick() {
                if (this.closeOnClick) {
                    this.isHidden = true;
                }
            },

            checkCustomCallback() {
                if (this.isHidden) {
                    // --- custom callback before open
                    new Promise((resolve, reject) => {
                        this.beforeOpen.call(this, resolve);
                    }).then(() => {
                        // --- hide dropdown on show other dropdowns
                        this.$root.$emit('bq-dropdown:hide');
                        this.prepare();
                    })
                        .catch(() => { throw Error('bq-dropdown promise error') });
                }
                else {
                    this.prepare();
                }
            },

            prepare() {
                // --- because we're have promise
                setTimeout(() => {
                    this.isHidden = !this.isHidden;
                    if (!this.isHidden) {
                        // --- because body is not in DOM
                        setTimeout(this.setPosition, 0);
                    }
                });
            },

            setPosition() {
                const button = this.$el.firstElementChild;
                const container = document.getElementById(this.generatedId);

                // --- if already in body
                if (!this.isAppended) {
                    document.body.appendChild(container);
                    this.isAppended = true;
                }

                const windowWidth = innerWidth;
                const windowHeight = innerHeight;

                const coords = this.getBoundingCoords(button);

                const bodyWidth = container.offsetWidth;
                const bodyHeight = container.offsetHeight;

                let currentTop = coords.top;
                let currentLeft = coords.left;

                this.positionTop =
                    // --- if behind bottom
                    ((currentTop + button.offsetHeight + bodyHeight) >= windowHeight) ?
                        (currentTop + pageYOffset - bodyHeight) :
                        (currentTop + pageYOffset + button.offsetHeight);

                this.positionLeft =
                    // --- if behind left
                    ((currentLeft + bodyWidth) >= windowWidth) ?
                        (currentLeft + pageXOffset - bodyWidth + button.offsetWidth) :
                        (currentLeft + pageXOffset);
            },

            // --- get element coordinates of Window
            getBoundingCoords(element) {
                element = element.getBoundingClientRect();

                return {
                    top: element.top,
                    left: element.left
                };
            }
        }
    }
</script>

<style>
    .bp-dropdown__btn {
        display: inline-flex;
        align-items: center;
        padding: 3px 5px;
        border: 1px solid #efefef;
        cursor: pointer;
        transition: background-color .1s ease;
    }

    .bp-dropdown__btn--active {
        background-color: #eee;
    }

    .bp-dropdown__icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        overflow: visible;
        transition: transform .1s ease;
    }

    .bp-dropdown__body {
        position: absolute;
        top: 0;
        left: 0;
        padding: 6px 8px;
        background-color: #fff;
        box-shadow: 0 5px 15px -5px rgba(0, 0, 0, .5);
    }

    .bp-dropdown__btn--active .bp-dropdown__icon {
        transform: rotate(-180deg);
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .1s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>