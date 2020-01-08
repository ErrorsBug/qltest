/**
 *
 * @author Dylan
 * @date 2018/7/9
 */

export function limitScrollBoundary(scrollContainer){
	if(!scrollContainer || scrollContainer.dataset.isBindedLimitScrollBoundary) return false;

	const dataAtTheBeginning = {
		posY: 0,
		scrollTop: 0,
		maxScroll: 0,
	};

	scrollContainer.addEventListener('touchstart', e => {
		const event = e.touches[0] || e;
		dataAtTheBeginning.posY = event.pageY;
		dataAtTheBeginning.maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
	});

	scrollContainer.addEventListener('touchmove', e => {
		if(dataAtTheBeginning.maxScroll <= 0){
			e.preventDefault();
		}

		const event = e.touches[0] || e;
		// 移动距离
		const distanceY = event.pageY - dataAtTheBeginning.posY;
		const scrollTop = scrollContainer.scrollTop;

		// 上边缘检测
		if (distanceY > 0 && scrollTop === 0) {
			// 往上滑，并且到头，禁止滚动的默认行为
			e.preventDefault();
			return;
		}

		// 下边缘检测
		if (distanceY < 0 && (scrollTop + 1 >= dataAtTheBeginning.maxScroll)) {
			// 往下滑，并且到头，禁止滚动的默认行为
			e.preventDefault();
			return;
		}
	});

	scrollContainer.dataset.isBindedLimitScrollBoundary = true;
}