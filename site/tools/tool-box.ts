/**
 * created by Zhigang Wu 2019.12.5
 * handleKeyBoardCollapseListen - 监听键盘收起逻辑
 * 主要处理微信6.7.4或iOS12以上版本出现键盘收起后被顶上去的视图没有弹回从而造成显示空白的问题
 * @param scrollTop 需要重置的scrollTop值
 */
export const handleKeyBoardCollapseListen = (scrollTop?: number): void => {
    const { wechat, system } = BrowserToolKit;
    if (wechat.isVersionGT('6.7.4') && system.isVersionGT('12')) {
        let timer;

        // 监听键盘弹起
        document.body.addEventListener('focusin', () => {
            console.log('键盘弹起');

            // 键盘弹起时，记录当前scrollTop的值
            if (scrollTop == undefined) {
                if (
                    document.documentElement &&
                    document.documentElement.scrollTop
                ) {
                    scrollTop = document.documentElement.scrollTop;
                } else if (document.body) {
                    scrollTop = document.body.scrollTop;
                } else {
                    scrollTop = 0;
                }
            }

            // 清除可能存在的因键盘收起所设的scrollTop重置定时器
            clearTimeout(timer);
        });

        // 监听键盘收起
        document.body.addEventListener('focusout', () => {
            console.log('键盘收起');

            // 考虑到可能存在多个输入框的场景，应排除焦点临时切换（即在输入框之间切换）这个特殊情况
            timer = setTimeout(() => {
                window.scrollTo(0, scrollTop || 0);
            }, 100);
        });
    }
};

/**
 * handleIOSPageReload - 解决iOS页面重载
 * iOS下页面在浏览器往返间不刷新，其原因是webkit的bfcache在起作用
 * 解决方案是当页面跳转时，终止bfworker，以达到页面显示时始终可以重载的效果
 * ref: https://github.com/LeuisKen/leuisken.github.io/issues/6
 */
export const handleIOSPageReload = () => {
    if (BrowserToolKit.system.isIOS()) {
        try {
            const bfWorker = new Worker(
                window.URL.createObjectURL(new Blob(['1']))
            );
            window.addEventListener('unload', function() {
                bfWorker.terminate();
            });
        } catch (err) {
            // if you want to do something here
            console.error(err);
        }
    }
    // disable bfcache
};

/* notice: 微信6.7.4或iOS12以上版本会出现键盘收起后被顶上去的视图没有弹回，从而造成显示空白的现象 */
export const BrowserToolKit = {
    wechat: {
        getInfo() {
            return window.navigator.userAgent.match(
                /MicroMessenger\/([\d\.]+)/i
            );
        },
        getVersion() {
            return this.getInfo() ? this.getInfo()[1] : '';
        },
        isVersionGT(version, useEqual: boolean = true) {
            return useEqual
                ? +this.getVersion().replace(/\./g, '') >=
                      +version.replace(/\./g, '')
                : +this.getVersion().replace(/\./g, '') >
                      +version.replace(/\./g, '');
        },
        isVersionLT(version, useEqual: boolean = true) {
            return useEqual
                ? +this.getVersion().replace(/\./g, '') <=
                      +version.replace(/\./g, '')
                : +this.getVersion().replace(/\./g, '') <
                      +version.replace(/\./g, '');
        }
    },
    system: {
        isIOS() {
            return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
        },
        isAndroid() {
            return /(Android)/i.test(navigator.userAgent);
        },
        isPC() {
            const agents = [
                'Android',
                'iPhone',
                'webOS',
                'BlackBerry',
                'SymbianOS',
                'Windows Phone',
                'iPad',
                'iPod'
            ];
            return agents.indexOf(navigator.userAgent) === -1;
        },
        getVersion(returnArr: boolean = false) {
            let version = returnArr ? [] : '';
            if (this.isIOS()) {
                navigator.appVersion.replace(
                    /OS (\d+)_(\d+)_?(\d+)?/g,
                    (o, f, m, l): any => {
                        version = returnArr
                            ? [f, m, l]
                            : `${f}.${m}${l ? `.${l}` : ''}`;
                    }
                );
            } else if (this.isAndroid) {
                navigator.appVersion.replace(
                    /Android (\d+).(\d+).?(\d+)?/g,
                    (o, f, m, l): any => {
                        version = returnArr
                            ? [f, m, l]
                            : `${f}.${m}${l ? `.${l}` : ''}`;
                    }
                );
            }

            return version;
        },
        // 自动识别所在系统，返回其当前版本号
        isVersionGT(version: string, useEqual: boolean = true) {
            const versionArr = version.split('.');
            const sysVersionArr = this.getVersion(true);
            let versionCode = 0,
                sysVersionCode = 0;

            versionCode = +versionArr
                .map(d => d || '0')
                .concat(Array(3 - versionArr.length).fill('0'))
                .join('');

            sysVersionCode = +sysVersionArr
                .map(d => d || '0')
                .concat(Array(3 - sysVersionArr.length).fill('0'))
                .join('');

            return useEqual
                ? sysVersionCode >= versionCode
                : sysVersionCode > versionCode;
        }
    }
};
