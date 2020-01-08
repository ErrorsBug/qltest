import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import './style.scss';
import yj from '../../img/yj.png'
import fg from '../../img/fg.png'

class StartInfo extends PureComponent {
    state = {
        opacity: 1
    }
    render() {
        const { username } = this.props;
        return <div className="loading">
            <div className="loading-title">
                <p>{ username?.length > 7 ? `${ username.slice(0,7) }…` : username }的<br/>《蜕变之旅》</p>
            </div>
            <div className = "Img-all">
                <div className="Img">
                    <img src={fg} className="fg" />
                    <img src={yj} />
                </div>
            </div>
            <div className="opening">
                <p>正在打开<span className="shadow_dot"></span></p>
            </div>
        </div>
    }
}

export default StartInfo