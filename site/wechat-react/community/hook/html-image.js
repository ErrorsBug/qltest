import * as htmlToImage from 'html-to-image';
import { useState, useEffect } from 'react';


/**
 * html转成images
 * @param {*} formatType 图片格式
 * @param {*} [parmas={}]
 * @returns
 */
function useHtmlImage(parmas = {}) {
    const [ dom, setDom ] = useState(null)
    const [ imageDom, setImageDom ] = useState(null);
    const [ loading, setLoading ] = useState(false)
    useEffect(() => {
        if(dom) {
            setLoading(true)
            htmlToImage.toSvgDataURL(dom).then((dataUrl) => {
                setImageDom(dataUrl)
                setLoading(false)
            }).catch((err) => {
                console.log(err, '======')
            })
        }
    },[dom])
    return [ imageDom, loading, setDom ]
}

export default useHtmlImage