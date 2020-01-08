import { digitFormat, linkTo,imgUrlFormat } from '../../../../comp/util';

const textMap = {
    desc: '简介',
    lectuerInfo: '关于讲师',
    suitable: '适合人群',
    gain: '你将获得',
}

Component({
    properties: {
        introduce: {
            type: Object,
            observer: 'onIntroduceChange',
        },
        isRebate: Boolean,
        rebateDate: String,
        notSummary: Boolean,
        summary: Array
    },

    data: {
        introList: [],
    },

    methods: {
        onIntroduceChange() {
            const { introduce = {} } = this.data

            let keys = Object.keys(introduce)
            if (!keys.length) {
                return false
            }

            let list = keys.map(key => {
                let title = textMap[key]
                let content = introduce[key]

                return { title, content }
            })

            this.setData({ introList: list })
        },
    }
})
