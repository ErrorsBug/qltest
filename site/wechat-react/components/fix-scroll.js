function disableScroll(event) {
    if (!event.canScroll) {
        event.preventDefault();
    }
}

function overscroll(el) {
    if (el) {
        el.addEventListener('touchstart', () => {
            const top = el.scrollTop;
            const totalScroll = el.scrollHeight;
            const currentScroll = top + el.offsetHeight;
            if (top === 0) {
                el.scrollTop = 1;
            } else if (currentScroll === totalScroll) {
                el.scrollTop = top - 1;
            }
        });

        el.addEventListener('touchmove', (event) => {
            if (el.offsetHeight < el.scrollHeight) event.canScroll = true;
        });
    }
}

export function fixScroll(selector) {
    const elSelectot = selector || '';
    overscroll(document.querySelector(selector));
    document.body.addEventListener('touchmove', disableScroll);
}

export function resetScroll() {
    document.body.removeEventListener('touchmove', disableScroll);
}
