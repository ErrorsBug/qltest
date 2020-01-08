import React, { PureComponent,Fragment } from 'react' 

  

export default class extends PureComponent{ 
    render() { 
        const {frontImg,backImg} = this.props
        return (
            <Fragment> 
                <div className="double-rotate">
                    <div className="container">
                        <div className="item front">
                            <img src={frontImg}/>
                        </div> 
                        <div className="item back">
                            <img src={backImg}/>
                        </div> 
                    </div>
                </div>
            </Fragment>
        )
    }
}