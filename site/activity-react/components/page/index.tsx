import * as React from 'react'
import Detect from '../../utils/detect'
import { autobind } from 'core-decorators'

// component
import Toast from '../toast'
import Loading from '../loading';

import './style.scss';
import './reset.scss';

export interface IPageProps {
    /** 指定样式 */
    className?: string
    /** 指定页面title */
    title: string
}

interface IState {
    /** toast options */
    toast: {
        show: boolean
        msg: string
        timeout: number
    }
}

@autobind
class Page extends React.Component<IPageProps, IState> {

    /** Toast 组件 */
    private toast: Toast

    /** Loading 组件 */
    private loading: Loading

    state = {
        toast: {
            show: false,
            msg: '',
            timeout: 1000
        }
    }

    componentDidMount() {
        this.setTitle(this.props.title);

        (window as any).toast = this.toast.show;

        (window as any).loading = this.loading.show;
    }

    componentWillReceiveProps(nextProps: IPageProps) {
        if (this.props.title !== nextProps.title) {
            this.setTitle(nextProps.title);
        }
    }

    setTitle(title: string) {
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

    render() {
        return ([
            <main key='page-container' className={'page-container ' + (this.props.className || '')}>
                { this.props.children }
            </main>,

            <Toast
                key='toast'
                ref={ el => this.toast = el }
            />,

            <Loading
                key='loading'
                ref={ el => this.loading = el }
            />
        ]);
    }
}

export default Page;
