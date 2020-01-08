/**
 *
 * @author Dylan
 * @date 2018/11/9
 */
import React from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		hasError: false
	};

	componentDidCatch(err, info) {
		// You can also log the error to an error reporting service
		console.error('---- component error did catch!!! fix it immediately!!! ----')
		console.error(info)
		console.error(err)

		this.setState({
			hasError: true
		}, () => { 
			setTimeout(() => { 
				throw new Error(err)
			},50)
		});
	}

	render() {
		if (this.state.hasError) {
			if(this.props.errMsg){
				return <h1 style={{color: 'red',textAlign: 'center', padding: '40px'}}>{this.props.errMsg}</h1>;
			}else{
				return null;
			}
		}

		return this.props.children;
	}
}

function catchClass(Target, args){
	return class Wrap extends React.Component {
		getWrappedInstance(){
			return this.instance
		}
		render() {
			return (
				<ErrorBoundary errMsg={args || ''}>
					<Target ref={r => this.instance = r} {...this.props} />
				</ErrorBoundary>
			)
		}
	};
}

function errorCatch(args) {
	if(typeof args !== 'undefined' && args.length === 0){
		return catchClass(args);
	}else{
		return function(Target){
			return catchClass(Target, args);
		}
	}
}

export default errorCatch
