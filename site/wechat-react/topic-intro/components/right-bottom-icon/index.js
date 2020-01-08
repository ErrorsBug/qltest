import React, { PureComponent,Fragment } from 'react' 
import classNames from 'classnames';
import { getVal, locationTo } from 'components/util';
import { autobind , throttle} from 'core-decorators';
 
@autobind
export default class extends PureComponent{ 
    state={
        scroll:false
    }
    componentDidMount = () => {  
        document.getElementById('scrolling-box')&&document.getElementById('scrolling-box').addEventListener('scroll',this.onScrollHandle)
    };

    
    @throttle(300)
    onScrollHandle() {   
        this.setState({
            scroll: true,
        });
        this.timer&&clearTimeout(this.timer)
        this.timer=setTimeout(()=>{
            this.setState({
                scroll: false,
            });
        }, 400)
 
    }

    render() { 
        const {scroll} =this.state
        let {scrolling=scroll, initClick, children ,className} = this.props 
        return (
            <Fragment> 
                <div className={classNames('un-right-bottom-icon',className,{
                    'scrolling':scrolling,
                    'scrolling-stop':!scrolling, 
                })} onClick={()=>{initClick&&initClick()}}>
                    {
                        children
                    }
                </div>
            </Fragment>
        )
    }
}