
Component({
    properties: {
        cateList: {
            type: Array,
            value: [],
        },
        activeTag: {
            type: String,
            value: '0',
            observer: 'onActiveTagChange'
        },
        panelChildTagId: {
            type: String,
            observer: 'onPanelChildTagId',
        },
    },

    data: {
        children: [ ],
        activeChildTag: '',
        scrollLeft: 0,
    },

    ready() {
        const info = wx.getSystemInfoSync()
        this.windowWidth = info.windowWidth
        this.scrollLeft = 0
        this.updateCategoryBarHeight();
    },

    methods: {
        onItemClick(e) {
            const dataset = e.currentTarget.dataset;
            this.triggerEvent('itemselected', { tagId: dataset.tagid });
        },

        onChildItemClick(e) {
            const dataset = e.currentTarget.dataset;
            this.triggerEvent('childitemselected', { tagId: dataset.tagid });
        },

        onCateBarScroll(e) {
            const { scrollLeft } = e.detail  
            this.scrollLeft = scrollLeft
        },

        onActiveTagChange() {
            const { activeTag } = this.data
            const target = this.data.cateList.find(item => item.id == activeTag);
            this.setData({
                children: target && target.children,
            });

            let query = wx.createSelectorQuery().in(this)
            query.select(`#tag${activeTag}`).boundingClientRect(res => {
                let innerPadding = 100
                let scrollLeft
                if (res.right + innerPadding > this.windowWidth) {
                    scrollLeft = this.scrollLeft + (res.right + innerPadding - this.windowWidth)
                }
                if (res.left - innerPadding < 0) {
                    scrollLeft = this.scrollLeft - (innerPadding - res.left)                    
                }
                if (scrollLeft !== undefined) {
                    this.setData({scrollLeft})
                }
            }).exec()
        },
        onPanelChildTagId() {
            const { panelChildTagId } = this.data  
            this.setData({ activeChildTag: panelChildTagId })
        },
	    updateCategoryBarHeight(){
		    wx.createSelectorQuery().in(this).select('.co-category-bar-container').boundingClientRect(rect => {
			    this.triggerEvent('updateCategoryBarHeight', {height: rect.height})
		    }).exec();

        }
    }
});