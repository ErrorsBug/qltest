import React, { PureComponent } from 'react';
import Page from 'components/page';
import { share } from 'components/wx-utils';

class RulesIntro extends PureComponent {

	componentDidMount(){
		share({
			title: '千聊会员-一张通往终身成长大学的门票',
			timelineTitle: '千聊会员-一张通往终身成长大学的门票',
			desc: '千聊会员，尊享口碑大课免费学、精品好课免费学、海量课程八折优惠、会员专属优惠券、大咖社群陪你学等多种会员权益！',
			timelineDesc: '千聊会员-一张通往终身成长大学的门票', // 分享到朋友圈单独定制
			imgUrl: window.location.protocol + require('../experience-invitation/img/share-logo.png'),
			shareUrl: `${window.origin}/wechat/page/membership-center`,
		});
	}

	render(){
		return (
			<Page title={`千聊会员规则说明`} className='rules-intro-page'>
				<div className="rules-intro-container">
					<div className={`container show`}>
						<div className="title">
							会员权益说明
						</div>
						<div className="sub-title">1. 精品课免费学2门</div>
						<div className="content">
							<p>
								精品课免费学页面所有课程任选两门免费领取，课程免费永久回听，领取时须两门课程同时领取。精品课会不定期进行更新，如已领取课程在精品课免费学页面下架不影响听课，在已购课程内可进行听课学习
							</p>
						</div>
						<div className="sub-title">2. 会员买课8折优惠</div>
						<div className="content">
							<p>
								千聊app及千聊课程中心（“千聊”公众号-菜单“正在直播”）内显示会员价的所有课程均可享受8折优惠
							</p>
						</div>
						<div className="sub-title">3. 任领优惠券后再8折</div>
						<div className="content">
							<p>
								每月500元会员专属优惠券，优惠券每周进行更新，会员使用优惠券可同时享受8折优惠
							</p>
						</div>
						<div className="sub-title">4. 免费畅听会员专区</div>
						<div className="content">
							<p>
								会员免费听专区内所有课程在会员期限内均可免费收听
							</p>
						</div>
						<div className="sub-title">5. 6张体验卡送亲友</div>
						<div className="content">
							<p>
								亲友领取体验卡可享受7天会员福利
							</p>
							<p>
								福利包含：买课8折优惠，会员专属优惠券，免费畅听会员专区
							</p>
							<p>
								福利不包含：精品课免费学2门，亲友共学
							</p>
						</div>
						{/* <div className="sub-title">6. 福利通知</div>
						<div className="content">
							<p>
								添加班主任微信号，及时收到新课上线、课程福利的通知
							</p>
						</div> */}
						<div className="title">常见问题Q&A</div>
						<div className="sub-title">Q1：购买成功可以退款吗？</div>
						<div className="content">
							<p>
								A1：很抱歉，由于千聊会员服务为虚拟内容商品，暂不支持退款，还请谅解
							</p>
						</div>
						<div className="sub-title">Q2：赠送的精品课在哪领取？</div>
						<div className="content">
							<p>
								A2：购买会员后进入会员精品课免费学页面进行领取
							</p>
						</div>
						<div className="sub-title">Q3：领取后的课程在哪里学习?</div>
						<div className="content">
							<p>
								A3：打开“千聊”公众号点击底部菜单栏：我的——我的课程——已购课程，即可查看所有购买报名课程并进入听课，支持永久回放收听学习；系列课程，按以上操作后，你可以在系列课介绍页往下拉，或者点击“课程”即可快速查看系列课所包含的子课程并进入听课
							</p>
						</div>
						<div className="title">温馨提示</div>
						<div className="content">
							<p>
								1. 购买会员卡，请您核对购买时的账号是否为本人账号，以免您的权益受到损失
							</p>
							<p>
								2. 支付成功当日起，有效期为365天（1年），逾期需要续费
							</p>
							<p>
								3. 千聊会员最终解释权归广州沐思信息科技有限公司所有
							</p>
							<p>
								4. 如果遇到其他问题，建议您打开千聊公众号点击个人中心-帮助中心-意见反馈提交问题。千聊客服热线：020-88525535（工作日9：30-19:00）
							</p>
						</div>
					</div>
				</div>
			</Page>
		)
	}
}

export default RulesIntro;