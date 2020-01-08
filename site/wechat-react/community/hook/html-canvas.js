import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import Canvas2Image from 'components/canvas-image'

/**
 * @desc : 利用html2canvas插件实现一个截屏功能
 * @param: 想要截图的dom节点
 * @return: 返回一个image标签
 */
function useH2C(parmas = {}, changeCanvas) {
    const [ dom, setDom ] = useState(null)
    const [ imageDom, setImageDom ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    let pCanvas = null;
    const initCanvas = (width, height) => {
        pCanvas = document.createElement("canvas");
        const scale = parmas.scale || 1.2; 
        pCanvas.width = width * scale; 
        pCanvas.height = height * scale; 
        pCanvas.style.width = width * scale + "px";
        pCanvas.style.height = height * scale + "px";
        pCanvas.getContext("2d");
        pCanvas.font = '"苹方 常规","微软雅黑"'
    }
    useEffect(() => {
        if(dom) {
            setLoading(true)
            const { width, height } = dom.getBoundingClientRect();
            initCanvas(width, height);
            html2canvas(dom, Object.assign({
                scale: 1.2,
                tainttest:true,
                canvas: pCanvas,
                logging: true,
                useCORS: true,
                height: height,
                width: width,
            }, parmas)).then(canvas => {
                const context = canvas.getContext('2d');
                context.mozImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.msImageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;
                const image = canvas.toDataURL('image/png');
                // const image = Canvas2Image.convertToPNG(canvas, width, height);
                changeCanvas && changeCanvas(canvas);
                setImageDom(image)
                pCanvas = null
                setLoading(false)
            }).catch((err) => {
                console.log(err)
            })
        }
    },[dom])
    return [ imageDom, loading, setDom ]
}

export default useH2C