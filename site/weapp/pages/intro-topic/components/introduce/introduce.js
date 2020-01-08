class IntroduceComponent {
    properties = {
        topicPo: {
            type: Object,
            observer:'onTopicPoChange',
        },
        summary: Array,
        notSummary: Boolean,
        profile: {
            type: Array,
            observer:'onProfileChange',
        },
    }

    data = {
        noContent: false,
        expand: false,

        images: [],
        audios: [],
    }

    ready() {
    }

    detached() {

    }

    methods = {
        onTopicPoChange() {
            const { speaker, guestIntr, remark } = this.data.topicPo  
            let { profile, noContent } = this.data
            let { notSummary } = this.properties

            noContent = !(speaker || guestIntr || remark || profile.length)

            this.setData({ noContent })
        },

        onProfileChange() {
            let {audios,images,profile} = this.data  
            audios = profile.filter(item=>item.type==='audio')
            images = profile.filter(item=>item.type==='image')
            
            this.setData({ audios, images })
        },
        toggleExpand() {
            let {expand} = this.data
            expand = !expand

            this.setData({ expand }, () => {
                this.triggerEvent('calcScrollHeight')
            })
        }
    }
}

Component(new IntroduceComponent())
