import React from 'react';
import PropTypes from 'prop-types';

const Item = (props) => {
    if(props.thekey==="identity"){
        return <i onClick={props.handleBtnClick} className="real-name-y"></i>
    }else{
        return <i className={props.thekey} onClick={props.handleBtnClick}></i>
    }
    
}




const SymbolList = (props) => {
    let symbolMap = new Map(props.symbolList.map(val => {
        return [val.key, val.time];
    }));

    return (
        <div className="symbol-list">
            { !props.isReal && props.isLiveCreator && <i onClick={props.handleRealNameBtnClick} className="real-name-n"></i> }
            { props.isReal && props.isLiveCreator && <i onClick={props.handleRealNameBtnClick} className="real-name-y"></i> }
            { props.isCompany && <i className="company" onClick={props.handleCompany} />}
            {
                props.symbolList.length>0&&props.symbolList.map((val, index) => {
                    let thekey=val.key;
                    if(thekey==="hot" && !symbolMap.has("dai")){ //热心群众和代言人，优先显示代言人
                        return <Item {...val} thekey={thekey} handleBtnClick={props.handleHotClick} key={val.key} />
                    }else if(thekey==="dai"){
                        return <Item {...val} thekey={thekey} handleBtnClick={props.handleDaiClick} key={val.key} />
                    }else if(thekey==="livet" && !symbolMap.has("pyramid")){ // 有金字塔就不显示教师节
                        return <Item {...val} thekey={thekey} handleBtnClick={props.handleTClick} key={val.key} />
                    }else if(thekey==="livev"){
                        return <Item {...val} thekey={thekey} handleBtnClick={props.handleVClick} key={val.key} />
                    }else if(thekey==="pyramid"){
                        return <Item {...val} thekey={thekey} handleBtnClick={props.showPyramidDialog} key={val.key} />
                    }
                })
            }
        </div>
    );
};

SymbolList.propTypes = {
    symbolList: PropTypes.array.isRequired,
    handleRealNameBtnClick: PropTypes.func.isRequired,
};

export default SymbolList;
