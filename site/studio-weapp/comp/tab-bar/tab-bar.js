Component({
    properties: {
        items: {
            type: Array,
            value: [],
        },
        fixedBar: {
            type: Boolean,
            value: false,
            observer: "onScroll"
        }
    },

    data: {
        showFixedBar: false
    },

    methods: {
        onTabItemClick(e) {
            const dataset = e.currentTarget.dataset;
            this.triggerEvent('tabclick', { key: dataset.key });
        },
        onScroll() {
            this.setData({
                showFixedBar: this.data.fixedBar
            });
        }
    }
});