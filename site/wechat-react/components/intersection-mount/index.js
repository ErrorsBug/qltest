/**
 *
 * @author Dylan
 * @date 2019-03-26
 */
import React, {PureComponent} from 'react';

class IntersectionMount extends PureComponent {

	state = {
		mountChildren: false
	};

	componentDidMount() {
		const isSupportIntersectionObserver = 'IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype;
		if(isSupportIntersectionObserver){
			this.observer = new window.IntersectionObserver(entries => {
				if (entries[0].intersectionRatio > 0) {
					console.log('进入可视区域');
					this.observer.disconnect();
					if(!this.state.mountChildren){
						this.setState({
							mountChildren: true
						});
					}
				}
			});
			this.observer.observe(this.wrapperRef);
		}else{
			this.setState({
				mountChildren: true
			});
		}
	}

	render(){
		return (
			<React.Fragment>
				{
					!this.state.mountChildren && <div ref={r => this.wrapperRef = r} />
				}
				{
					this.state.mountChildren && this.props.children
				}
			</React.Fragment>
		)
	}
}

export default IntersectionMount;


