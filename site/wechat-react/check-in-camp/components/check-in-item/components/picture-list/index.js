import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';
import PictureItem from '../../../picture-item';

@autobind
export class PictureList extends Component {
    static propTypes = {
       
    }

    singleImgOnLoadHandle(img, wrapperRef){
		let wrapper = this[wrapperRef];
		if(img.height > img.width){
			if(img.height * 0.8 > img.width){
				img.style.height = wrapper.clientWidth * 1.2 + 'px';
			}else{
				img.style.width = '100%';
			}
		}else{
			if(img.width * 0.8 > img.height){
				img.style.width = wrapper.clientWidth * 1.2 + 'px';
			}else{
				img.style.height = '100%';
			}
		}
    }
    
    showOriginImg(url, imgUrlList){
		window.showImageViewer(url, imgUrlList);
	}

    render() {
        const picList = this.props.photoUrls || []

        return (
            <div className="picture-list-container">
                <div className={`img-list${picList.length === 4 ? ' sp' : ''}`}>
                    {
                        picList.map((url, imgIndex) => {
                            if (!url) return;
                            return (
                                picList.length === 1 ?
                                    <div className="img-item sp" key={imgIndex} ref={(el) => { this[`imgWrapper${imgIndex}`] = el; }}>
                                        <img 
                                            src={url + '?x-oss-process=image/resize,s_425'} 
                                            onLoad={(e) => this.singleImgOnLoadHandle(e.target, `imgWrapper${imgIndex}`)} 
                                            onClick={this.showOriginImg.bind(this, url, picList)}
                                        />
                                    </div>
                                    :
                                    <div className="img-item" 
                                        key={imgIndex} 
                                        style={{backgroundImage: `url(${url.replace(/\@.*/,'')}?x-oss-process=image/resize,s_170)`}} 
                                        onClick={this.showOriginImg.bind(this, url, picList)} 
                                    />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(PictureList)
