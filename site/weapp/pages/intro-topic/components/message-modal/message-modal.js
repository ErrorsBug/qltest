import { imgUrlFormat, getVal } from '../../../../comp/util'
import request from '../../../../comp/request';
import * as regeneratorRuntime from '../../../../comp/runtime'

class MessageModalComponent {
    properties = {
        list:Array,
        animationData: Object,
        serverTime: Number,
    }

    data = {
        icon_close_src:__uri('./img/icon-close.png'),
    }

    ready() {
        
    }

    detached() {

    }

    methods = {
        onPraiseClick(e) {
            const { id } = e.detail
            this.triggerEvent('onPraiseClick', { id })
        },
        hideModal() {
            this.triggerEvent('hideMessageModal')
        },
        onTouchMove(e) {
            return false
        },
        onTouchMove() {
            return false  
        },
    }
}

Component(new MessageModalComponent())
