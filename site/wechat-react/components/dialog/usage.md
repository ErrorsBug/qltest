
## 居中弹框的简单使用，具体api请查看源码

```javascript

    <MiddleDialog 
        show={ false }                                 // 是否显示弹框
        theme='primary'                                // 主题
        bghide={ true }                                // 是否点击背景关闭
        title='哈哈哈'                                  // 标题，不提供则不显示标题
        buttonTheme='block'                            // 按钮样式 有线条(line)和块状(block)
        buttons='cancel-confirm'                       // 按钮配置
        close={ true }                                 // 是否显示关闭
        onClose={ this.onClose.bind(this) }            // 关闭事件回调，组件不会自动关闭，请使用redux控制组件显示与否
        onBtnClick={ this.onBtnClick.bind(this) }>     // 按钮点击事件，回调有一个tag标记，根据这个判断业务处理
    </MiddleDialog>
```

## 底部弹出框
```javascript

    <BottomDialog 
        show={ true }
        bghide={ true }
        theme='list'
        title='哈哈哈哈'
        titleLabel='Hehheehe'
        items={
            [
                {
                    key: 'del',
                    icon: 'icon_trash',
                    content: '删除系列课<span class="danger">不可恢复</span>'
                }
            ]
        }
        close={ true }
        onClose={ this.onClose.bind(this) }
        onItemClick={ this.onItemClick.bind(this) } >
    </BottomDialog>

```

## confirm 弹框
```javascript

    <Confirm 
        content = '你好!!!!!!'
        onClose = { this.onClose.bind(this) }
        onBtnClick = { this.onItemClick.bind(this) }
        ref = 'confirm'
    >
    </Confirm>

```