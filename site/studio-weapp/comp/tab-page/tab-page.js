Component({
    options: {
        multipleSlots: true
    },
    properties: {
        tabs: {
            type: Array,
            value: []
        }
    },

    data: {

    },

    methods: {
        handleTabTap(e) {
            let curTarget = e.currentTarget;
            let isCurrent = curTarget.dataset.iscurrent;
            let key = curTarget.dataset.key;

            if (isCurrent) {
                return;
            }

            this.triggerEvent('itemclick', { key });
        }
    }
});