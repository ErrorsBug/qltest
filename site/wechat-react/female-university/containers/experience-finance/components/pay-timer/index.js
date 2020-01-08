
import React, { PureComponent } from 'react'; 

class PayTimer extends PureComponent { 
	render(){ 
        const {d,h,m,s,t}=this.props
		return ( 
            <div className="uni-pay-timer" dangerouslySetInnerHTML={{__html:`优惠倒计时${ `${d>0?`<span>${d}</span>天`:''}<span>${h}</span>时<span>${m}</span>分<span>${s}</span>秒<span>${t}</span>` }`}}></div>
        )
	}
}

export default PayTimer;