class TabBarComponent {
    properties = {
        tabs: Array,
        active: String,
    }

    data = {
    }

    ready() {
        console.log('this.data', this.data)
    }

    detached() {

    }

    methods = {
        onTabTap(e) {
            this.triggerEvent('onTabTap', { key: e.currentTarget.dataset.key })
        },
    }
}

Component(new TabBarComponent())
