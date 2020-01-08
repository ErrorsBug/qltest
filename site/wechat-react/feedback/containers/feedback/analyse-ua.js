module.exports = function (ua = '') {
    if (!ua && typeof window !== 'undefined' && window.navigator && window.navigator.userAgent) {
        ua = window.navigator.userAgent;
    }

    let dev, os, match;

    if (match = ua.match(/(iPhone|iPad|iPod)(.*OS\s([\d_]+))?/i)) {
        dev = match[1];
        if (match[3]) {
            os = 'iOS ' + match[3].replace(/_/g, '.');
        }
        try {
            let canvas = document.createElement('canvas'),
                gl = canvas.getContext('experimental-webgl'),
                debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            renderer && (dev += '; ' + renderer);
        } catch (e) {}
    } else if (match = ua.match(/Android\s([\d\.]+)[;\s]+([^\)]*)/i)) {
        dev = match[2];
        os = 'Android ' + match[1];
    } else if (match = ua.match(/(windows[^;]*)/i)) {
        dev = 'PC';
        os = match[1];
    } else if (match = ua.match(/Macintosh.*(OS\sX\s[\d_]+)/i)) {
        dev = 'Mac';
        os = match[1].replace(/_/g, '.');
    }

    if (!dev && !os) {
        os = ua;
    }

    // console.log(match)
    
    return {
        device: dev,
        os: os,
    }
}



/**
iPhone cpu 对应机型

A12
XS, XSM, XR

A11
8, 8P

A10
7, 7P

A11
X

A9
6S, 6SP, SE

A8
6, 6P

A7
5S

A6
5, 5C

A5
4S

A4
4
 */