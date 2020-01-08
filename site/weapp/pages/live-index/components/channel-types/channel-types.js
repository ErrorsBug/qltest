Component({
    properties: {
        list: Array,
        currentChannelTab: Number,
    },

    data: {

    },

    ready() {
    },

    methods: {
        switchChannelTab(e) {
            const id = e.currentTarget.dataset.id
            this.triggerEvent('switchChannelTab', { id })
        },
    },
});