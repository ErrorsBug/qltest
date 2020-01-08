import { imgUrlFormat, getVal } from '../../../../comp/util'
import request from '../../../../comp/request';
import * as regeneratorRuntime from '../../../../comp/runtime'

class MessageBoardComponent {
    properties = {
        list: {
            type: Array,
        },
        serverTime: Number,
    }

    data = {
    }

    ready() {
        
    }

    detached() {

    }

    methods = {
        onPraiseClick(e) {
            const {id} = e.detail
            this.triggerEvent('onPraiseClick', { id })
        },
        viewMore() {
            this.triggerEvent('showMessageModal')  
        },
    }
}

Component(new MessageBoardComponent())
