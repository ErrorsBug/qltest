import React, { useEffect, useState,  } from 'react'

/**
 * 图片懒加载，传递image的class名称
 * 标签写法<img class="lazy" src="图片站位" data-src="真实图片" data-srcset="真实图片" alt="">
 * lazyCls：啦加载的对应的class
 * observerParmas: 配置
 * @param {*} { lazyCls = 'img.lazy', observerParmas = {}, children }
 * @returns
 */
function LazyImage({ lazyCls = 'img.lazy', observerParmas = {}, children }) {
    const [observer, setObserver] = useState(null)
    const initLazyObserver = () => {
        var lazyImages = Array.from(document.querySelectorAll(lazyCls));
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: [0.7]
        };
        const Observer = new IntersectionObserver(callback, Object.assign(options, observerParmas))
        lazyImages.forEach(function(lazyImage) {
            Observer.observe(lazyImage);
        });
        setObserver(Observer)
    }
    const callback = (entries) => {
        const rmCls = lazyCls.split('.')[1]
        entries.forEach((entry) => {
            if(entry.isIntersecting) {
                let lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.srcset = lazyImage.dataset.srcset;
                lazyImage.classList.remove(rmCls);
                observer?.unobserve(lazyImage);
            }
        });
    }
    const unObserver = () => {
        observer  && observer.disconnect()
    }
    useEffect(() => {
        initLazyObserver();
        return () => {
            unObserver()
        };
    }, [])
    return children
}
 
export default LazyImage