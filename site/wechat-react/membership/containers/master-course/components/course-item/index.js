
import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import Picture from 'ql-react-picture';
import { digitFormat, formatMoney } from 'components/util'

class MasterCourseItem extends PureComponent {

    itemDetails () {
        const { itemClick, data } = this.props
        itemClick && itemClick(data)
    }

    renderPrice () {
        const { data, isOpenMemberSelect, isMember } = this.props
        if (data.isAuth === 'Y' || data.isSelected === "Y") {
            return <span>永久回听</span>
        }

        if (isMember) {
            if (isOpenMemberSelect) return <span className="member-price ml-20">会员免费</span> 
            else return <span className="member-price ml-20">会员价: &yen;{formatMoney(data.memberPrice)}</span>
        } else return <span className="member-price"> (会员免费)</span>
    }

	render(){
        const { data, isOpenMemberSelect, index, isMember } = this.props

		return (
            <div 
                className={`master-course-item ${data.isChoose ? 'select' : ''}`}
                >
                <div className="item-container" onClick={this.itemDetails.bind(this)}>
                    <div className="item-poster">
                        <Picture src={data.logo} />
                        
                        {
                            data.isAuth === "Y" && (
                                <span>已购</span>
                            )
                        }
                    </div>
                    <div className={`item-desc ${(isMember && !isOpenMemberSelect) || data.isAuth === "Y" || data.isSelected === "Y" ? 'pd-30': ''}`}>
                        <p className="title line-2">{data.businessName}</p>
                        <p className="desc sing-line">{data.teacherName}-{data.teacherIntro}</p>
                        <div className="info">
                            <span>{digitFormat(data.learningNum)}次学习</span>
                            <p>
                                {
                                    data.isAuth !== "Y" && data.isSelected !== "Y" && <span className={`${isMember ? "price" : ''}`}>￥{formatMoney(data.amount)}</span>
                                }
                                {
                                    this.renderPrice()
                                }
                            </p>
                        </div>
                    </div>

                    {
                        isOpenMemberSelect && data.isAuth !== "Y" && data.isSelected !== "Y" && (
                            <div className="select-box" onClick={(e) => { e.stopPropagation(); this.props.itemChoose(data, index)}}>
                                <span className="bg"></span>
                            </div>
                        )
                    }
                </div>
			</div>
		)
	}
}

export default MasterCourseItem;