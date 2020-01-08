import React, { PureComponent,Fragment } from 'react' 

export default class extends PureComponent{
    state={
        on:0
    }
    
    componentDidMount = () => {
        
    };
    componentDidUpdate(prevProps, prevState) { 
    }
    
    componentWillReceiveProps(nextProps) {
        
    }
    
    longClick=0
    timeOutEvent=null
    touchstart= (e)=>{
        console.log('start')
        this.longClick=0;//设置初始为0
        this.timeOutEvent = setTimeout(()=>{
            //此处为长按事件-----在此显示遮罩层及删除按钮
            this.longClick=1;//假如长按，则设置为1
        },600);
    } 
    touchmove= (e)=>{
        console.log('move')
        clearTimeout(this.timeOutEvent);
        this.timeOutEvent = 0;
        e.stopPropagation();
    } 
    touchend= (e)=>{ 
        clearTimeout(this.timeOutEvent);
        if(this.timeOutEvent!=0 && this.longClick==0){//点击
            //此处为点击事件----在此处添加跳转详情页
            console.log('click')
        }else{
            console.log('longclick') 
            this.props.longTouch() 
        }
        return false;
    }
    render() { 
        return (
            <Fragment>
               <div 
                    onTouchStart={(e)=>this.touchstart(e)}
                    onTouchMove={(e)=>this.touchmove(e)}
                    onTouchEnd={(e)=>this.touchend(e)} >
                    {
                        this.props.children
                    }
                </div>
            </Fragment>
        )
    }
}