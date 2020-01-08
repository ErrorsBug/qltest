import * as React from 'react';
import { isArray } from 'util';
import {
    BrowserToolKit,
    handleIOSPageReload,
    handleKeyBoardCollapseListen
} from '../../../../tools/tool-box';

/**
 * 适配iOS的组件wrapper，可解决输入后视野回滚和重载等问题
 * @param mode 应用模式：目前可供选择的有输入和重载两种模式
 */
const iOSCompatible = (
    mode: Array<'input' | 'reload'> | 'input' | 'reload' = ['input', 'reload']
): any => (WrappedComponent: any) => {
    return BrowserToolKit.system.isIOS()
        ? class extends React.Component {
              componentDidMount() {
                  const execModeHandler = _mode => {
                      if (_mode === 'input') {
                          handleKeyBoardCollapseListen();
                      } else if (_mode === 'reload') {
                          handleIOSPageReload();
                      }
                  };

                  if (isArray(mode)) {
                      mode.forEach(m => execModeHandler(m));
                  } else {
                      execModeHandler(mode);
                  }
              }

              render() {
                  return <WrappedComponent {...this.props} />;
              }
          }
        : WrappedComponent;
};

export default iOSCompatible;
