import * as React from 'react';

import { ICourseItem } from '../../models/course.model'
import CourseItem from './components/course-item'
import styles from './style.scss'

export interface CourseListProps {
    list: Array<ICourseItem>
    agentInfo: any;
    setReprintInfo: any;
    liveId: any;
    setPromotionInfo: any;
    setPromotionModalShow: any;
    setLoginModalShow: any;
}

export default class CourseList extends React.Component<CourseListProps & any, any> {

    get placeholder() {
        const { list } = this.props
        if (!(list.length % 4)) {
            return []
        }
        let placeholderLen = 4 - this.props.list.length % 4
        let placeholder = []
        for (let i = 0; i < placeholderLen; i++){
            placeholder.push(1)
        }
        return placeholder
    }

    render() {
        const { isExist, agentId } = this.props.agentInfo;
        const userIdentity = this.props.userIdentity;

        return (
            <div className={styles.container}>
                {
                    this.props.list.map((item, index) => {
                        return <CourseItem 
                            index={index}
                            course={item} 
                            key={`course-${index}`} 
                            isExist={isExist} 
                            userIdentity={userIdentity}
                            setReprintInfo={this.props.setReprintInfo}
                            setReprintModalShow={this.props.setReprintModalShow}
                            agentId={agentId}
                            liveId={this.props.liveId}
                            setPromotionInfo={this.props.setPromotionInfo}
                            setPromotionModalShow={this.props.setPromotionModalShow}
                            setLoginModalShow={this.props.setLoginModalShow}
                        />
                    })
                }
                {/* {
                    this.placeholder.map((item, index) => {
                        return <div className={styles['placeholder-course']} key={`placeholder-${index}`}></div>
                    })
                } */}
            </div>
        );
    }
}
