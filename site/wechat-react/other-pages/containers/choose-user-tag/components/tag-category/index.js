import React, {Component} from 'react';

// 用户标签选择组件
class TagCategory extends Component {

    render() {

        const { data, index, onSelect } = this.props

        return (
            <div 
                className="tag-category on-visible" 
                data-log-region={'tag-category-' + data.id}
                style={ {color: data.foregroundColor} }
                >
                <div className="tag-name">
                    <img src={data.logo} alt=""/>
                    <p>{data.name}</p>
                </div>
                <div className="tag-list">
                    {
                        data.childenList && data.childenList.map( (item, indexItem) => (
                            <span 
                                key={`tag-item-${indexItem}`}
                                className={ `tag-item on-log on-visible ${item.select == 'Y' ? 'select' : 'no-select'}` } 
                                data-log-region={'tag-item-' + data.id}
                                data-log-pos={item.id}
                                style={ {border: `1px solid ${data.foregroundColor}`, background: data.foregroundColor} }
                                onClick={ () => {onSelect(item, index)}}
                                >{item.name}</span>
                        ))
                    }
                </div>
            </div>
        );
    }
}

TagCategory.propTypes = {

};

export default TagCategory;
