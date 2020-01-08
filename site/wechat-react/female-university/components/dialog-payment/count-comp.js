import React, { PureComponent } from 'react'
import countdownHoc from '../../hoc/countdown'

const Count = ({ m, s, sm }) => {
    return (<span className="countdown-time"><i>{m}</i>分<i>{s}</i>秒<i className="countdown-sm">{sm}</i></span>)
}

const CoutCompt = countdownHoc(Count)

export default class CountComp extends PureComponent{
    state = {
        endTime: ''
    }
    componentWillMount(){
        this.initTime()
    }
    initTime = () => {
        let campTime = localStorage.getItem(`guideTime`);
        const time = 15 * 60 * 1000;
        const sysTime = new Date().getTime()
        if(campTime && ((Number(campTime) + time) > sysTime)) {
            campTime = campTime;
        } else {
            campTime = sysTime;
            localStorage.setItem(`guideTime`, campTime);
        }
        const endTime = (Number(campTime) + time)
        this.setState({
            endTime
        })
    }

    render() {
        const { endTime } = this.state;
        return (
            <CoutCompt endTime={ endTime } />
        )
    }
}