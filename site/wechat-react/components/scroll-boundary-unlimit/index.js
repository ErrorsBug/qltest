//绑定事件
export function limitScrollBoundary(scrollContainer){
	if(!scrollContainer || scrollContainer.dataset.isBindedLimitScrollBoundary=="true") return false;
	scrollContainerLocal=scrollContainer

	scrollContainer.addEventListener('touchstart', touchstartFn);

	scrollContainer.addEventListener('touchmove', touchmoveFn);

	scrollContainer.dataset.isBindedLimitScrollBoundary = true;
}

//移除事件
export function unlimitScrollBoundary(scrollContainer){ 
	if(!scrollContainer || scrollContainer.dataset.isBindedLimitScrollBoundary=="false") return false;
	scrollContainer.removeEventListener('touchstart', touchstartFn);

	scrollContainer.removeEventListener('touchmove', touchmoveFn);

	scrollContainer.dataset.isBindedLimitScrollBoundary = false;
}

let scrollContainerLocal;

const dataAtTheBeginning = {
	posY: 0,
	scrollTop: 0,
	maxScroll: 0,
};
const touchstartFn=e => {
	const event = e.touches[0] || e;
	dataAtTheBeginning.posY = event.pageY;
	dataAtTheBeginning.maxScroll = scrollContainerLocal.scrollHeight - scrollContainerLocal.clientHeight;
}
const touchmoveFn=e => {
	if(dataAtTheBeginning.maxScroll <= 0){
		e.preventDefault();
	}

	const event = e.touches[0] || e;
	// 移动距离
	const distanceY = event.pageY - dataAtTheBeginning.posY;
	const scrollTop = scrollContainerLocal.scrollTop;

	// 上边缘检测
	if (distanceY > 0 && scrollTop === 0) {
		// 往上滑，并且到头，禁止滚动的默认行为
		e.preventDefault();
		return;
	}  
	// 下边缘检测
	if (distanceY < 0 ) {
		// 往下滑，并且到头，禁止滚动的默认行为
		e.preventDefault();
		return;
	}
}
