/** 事件类型 */
type LogEvent = "event" |  "pv" | "click" | "visible" | "commonlog";

/** 日志事件选项 */
interface EventOption {
    /** 点击位置横坐标值 */
    x?: string; 
    /** 点击位置纵坐标值 */
    y?: string;
    /** 点击元素的名称 */
    name?: string; 
    /** 点击元素所在区域 */
    region?: string; 
    /** 点击元素在区域所在的位置 */
    pos?: string; 
    /** 点击元素在区域位置上的序号 */
    index?: string;
}

/** 日志上报 类型声明 */
declare namespace _qla {
    // 类型不一定完整，有遗漏的可以补充
    
    /** 自定义日志事件 */
    function event(e: LogEvent, option?: EventOption): void; 
    /** 收集曝光 */
    function collectVisible(): void;

    function bindVisibleScroll(el?: string) :void;

    function bindBrowseScroll(val?: string): void;
}

/**
 * 全局toast
 * @param message toast信息
 * @param duration 弹窗弹出时长
 */
declare function toast(message: string, duration?: number);