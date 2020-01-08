import React, { Component } from 'react'
import PressHoc from 'components/press-hoc';
import { getClassQr } from '../../actions/home'

export default class extends Component {
    state = {
        url: ''
    }
    async componentDidMount() {
        const { classId } = this.props;
        const { classInfo } = await getClassQr({ classId })
        this.setState({
            url: classInfo?.qrCode || ''
        })
    }
    onPress = () => {
        this.props.groupHide && this.props.groupHide();
    }
    render() {
        const { url } = this.state
        return (
            <div className="un-group-card">
                <PressHoc onPress={ this.onPress } className="un-group-bg" region="un-class-code">
                    <img src={ url } />
                </PressHoc>
            </div>
        )
    }
}