import React, {
    PureComponent, Fragment
} from 'react';
import PropTypes from 'prop-types';

// import { getRouter } from '../../containers/app';
import Detect from '../detect';

/**
 * 用于修改网页标题和 body class 等
 */
class Page extends PureComponent {

    componentWillMount() {
        // this.reconfigWx();
        recordRouteHistory();
    }

    componentDidMount() {
        const {title, cs, banpv=false, description, keyword} = this.props;
        console.log(this.props)

        this.setClass(cs);
        this.setTitle(title);
        this.setMeta('description', description)
        this.setMeta('keyword', keyword)
        if(!banpv) setTimeout(() => {
            this.pvLog();
        }, 0);

    }

    pvLog() {

        // let router = getRouter();

        // if (router && router.location && router.location.action === 'PUSH') {
        typeof _qla != 'undefined' && _qla('pv', {

        });
        // }
    }

    reconfigWx() {
        let wxConfig = document.querySelector('#wxConfig');
        if (wxConfig) {
            wxConfig.parentNode.removeChild(wxConfig);
        }

        const script = document.createElement('script');
        script.id = 'wxConfig';
        script.src = `/api/js-sdk/wx?actions=hide_all&${Date.now()}`;
        document.body.appendChild(script);

    }

    componentWillReceiveProps(nextProps) {
        const {
            title,
            cs,
            description,
            keyword
        } = this.props;
        if (nextProps.title !== title) {
            this.setTitle(nextProps.title)
        }

        if (nextProps.cs !== cs) {
            this.setClass(nextProps.cs);
        }

        if (nextProps.description !== description) {
            this.setMeta('description', nextProps.description)
        }
        if (nextProps.keyword !== keyword) {
            this.setMeta('keyword', nextProps.keyword)
        }
    }

    componentWillUnmount() {
        const {
            title,
            cs
        } = this.props;

        this.removeClass(cs);
    }

    setTitle(title) {
        if (title) {
            document.title = title;
        }

        // Magic iPhone 微信需要通过加载 iframe 来刷新 title
        if (Detect.os.ios && Detect.os.weixin) {
            var iframe = document.createElement("iframe");
            iframe.setAttribute("src", "/favicon.ico");
            iframe.style.display = 'none';
            iframe.addEventListener('load', function() {
                setTimeout(function() {
                    //iframe.removeEventListener('load');
                    document.body.removeChild(iframe);
                }, 0);
            });
            document.body.appendChild(iframe);
        }
    }

    setMeta (name, content) {
        if (!name || !content) return
        let meta = document.querySelector(`meta[name='${name}']`)
        if (!meta) {
            meta = document.createElement('meta');
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
        meta.content = content;
        meta.name = name;
    }

    setClass(cs) {
        if (cs) {
            document.body.classList.add(cs);
        }
    }

    removeClass(cs) {
        if (cs) {
            document.body.classList.remove(cs);
        }
    }

    render() {
        const {
            component: Component,
            cs,
            title,
            ...props
        } = this.props;

        return (
            <Fragment>
                <Component {...props} ref={el => (this.containerRef = el)}>
                    {this.props.children}
                </Component>
                <div className="co-win-course-eval-container"></div>
            </Fragment>
        )
    }
}

Page.propTypes = {
    component: PropTypes.any,
    title: PropTypes.string,
    description: PropTypes.string,
    keyword: PropTypes.string,
    cs: PropTypes.string,
}

Page.defaultProps = {
    component: 'div',
    title: '',
    description: '',
    keyword: '',
    cs: '',
}

export default Page;



/**
 * 记录页面路由到sessionStorage
 * 相同url只记录一次，最大记录长度为2
 * 
 * ！！！切记获取上一页url时要用相对index，避免以后修改最大长度
 */
export function recordRouteHistory() {
    if (typeof location !== 'undefined' && typeof sessionStorage !== 'undefined') {
        try {
            const key = 'ROUTE_HISTORY';

            let routes = JSON.parse(sessionStorage.getItem(key));
            routes instanceof Array || (routes = []);

            if (routes[routes.length - 1] != location.href) {
                routes.push(location.href);
                if (routes.length > 2) routes.shift();
    
                sessionStorage.setItem(key, JSON.stringify(routes));
            }
        } catch (e) {
        }
    }
}