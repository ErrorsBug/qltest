
// 支付成功统计
export const logPayTrace = (traceData) => {
    try {
        if (typeof _qla != 'undefined') {
            _qla('event', {
                category: 'wechatPay',
                action:'success',
                business_id: traceData.id,
                business_type: traceData.type,
                business_pay_type: traceData.payType,
                trace_page: window.sessionStorage && window.sessionStorage.getItem('trace_page') || '',
            });
        }
  } catch (error) {
      console.log(error);
  }
}

export const logGroupTrace = (traceData) => {
    try {
        if (typeof _qla != 'undefined') {
            _qla('event', {
                category: 'countGroup',
                action:'success',
                business_id: traceData.id,
                business_type: traceData.type,
                trace_page: window.sessionStorage && window.sessionStorage.getItem('trace_page') || '',
            });
        }
    } catch (error) {
        console.log(error);
    }
}

// 长按扫描二维码统计
export const logQRCodeTouchTrace = (traceData) => {
    try {
        if (typeof _qla != 'undefined') {
            _qla('event', {
                category: traceData,
                action:'success',
                trace_page: window.sessionStorage && window.sessionStorage.getItem('trace_page') || '',
            });
        }
    } catch (error) {
        console.log(error);
    }
}

// 会员购买渠道统计
export const logMemberTrace = (traceData) => {
    try {
        if (typeof _qla != 'undefined') {
            _qla('event', {
                category: 'wechatPay',
                action:'success',
                ch: traceData.wcl,
                business: traceData.business,
                business_pay_type: 'MEMBER'
            });
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * 事件日志打印共用方法
 * @param  {[type]} data    要打印的日志参数（传对象）
 * @param  {[type]} logType 日志类型，默认为事件日志（'event')
 * @return {[type]}         [description]
 */
export const eventLog = (data) => {
    try {
        if (typeof _qla != 'undefined' && typeof data === 'object') {
            _qla('event', {...data, trace_page: window.sessionStorage && window.sessionStorage.getItem('trace_page') || '',});
        }
    } catch (error) {
        console.log(error);
    }
}
