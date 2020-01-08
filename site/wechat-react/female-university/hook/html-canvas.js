import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

/**
 * @desc : 利用html2canvas插件实现一个截屏功能
 * @param: 想要截图的dom节点
 * @return: 返回一个image标签
 */
function useH2C(parmas = {}) {
    const [ dom, setDom ] = useState(null)
    const [ imageDom, setImageDom ] = useState(null);
    const [ loading, setLoading ] = useState(false)
    useEffect(() => {
        if(dom) {
            setLoading(true)
            html2canvas(dom, Object.assign({
                scale: 1.2,
                tainttest:true,
                logging: true,
                useCORS: true,
            }, parmas)).then(canvas => {
                var image = canvas.toDataURL('image/png');
                setImageDom(image)
                setLoading(false)
            }).catch((err) => {
                console.log(err)
            })
        }
    },[dom])
    return [ imageDom, loading, setDom ]
}

export default useH2C