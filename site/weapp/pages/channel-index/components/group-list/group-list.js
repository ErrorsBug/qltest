import { digitFormat, linkTo,imgUrlFormat } from '../../../../comp/util';

Component({
    properties: {
        groupinglists: {
            type:Object,
            value:[],
            observer:'onListChange',
        },
        myGroupId: String,
        currentServerTime: Number,
        channelId:String,
    },

    data: {
        list:[],
    },
    methods: {
        onListChange(){
            const {groupinglists} = this.data
            const list = (groupinglists.headUrlList || []).map(item=>{
                return {
                    ...item,
                    headUrl:imgUrlFormat(item.headUrl,''),
                }
            })
            this.setData({list})
        },
        onFormSubmit(e) {
            const formId = e.detail.formId
            this.triggerEvent('onGroupFormSubmit', { formId })
        },
        onJoinGroupClick(e) {
            let groupId = this.data.groupinglists[e.target.dataset.index].id;
            this.triggerEvent('onJoinGroup', {groupId});
        },
        onCheckGroupClick(e) {
            let groupId = this.data.groupinglists[e.target.dataset.index].id;
            wx.redirectTo({
                url: `/pages/course-group/course-group?groupId=${groupId}&channelId=${this.data.channelId}`
            });
        }
    }
});