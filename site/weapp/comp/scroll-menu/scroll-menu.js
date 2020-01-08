export const initScrollMenus = (ctx, scrollMenuItems, activeId, parentTagId) => {
    ctx.handleScrollMenuItemTap = (e) => {
        let curTarget = e.currentTarget,
            parentTagId = curTarget.dataset.parenttagid,
            id = curTarget.dataset.id,
            name = curTarget.dataset.name,
            isActive = curTarget.dataset.active,
            type = curTarget.dataset.type,
            url;

        if (isActive) {
            return;
        }

        if (type === 'recommend') {
            url = '/pages/assort/assort?id=' + parentTagId;
        } else {
            url = '/pages/species/species?id=' + id + '&parentTagId=' + parentTagId + '&name=' + name;
        }

        wx.redirectTo({
            url: url
        });
    };

    scrollMenuItems = scrollMenuItems.map((item ,key) => {
        return {...item, active: item.id === activeId};
    });

    ctx.setData({
        parentTagId: parentTagId,
        scrollMenuItems
    });
};
