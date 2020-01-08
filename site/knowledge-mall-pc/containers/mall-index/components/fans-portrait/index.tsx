import * as React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classNames from 'classnames';

import { Input } from 'antd';

import {
    updateFansRemark,
    updateTagsSelected,
} from '../../../../actions/portrait';

import styles from './style.scss';

const { TextArea } = Input;

export interface props {
    fansTags: any[];
    fansRemark: any;
    tagsSelected: any[];
    updateFansRemark?: (params: string) => void;
    updateTagsSelected?: (params: any[]) => void;
}

@autobind
class FansPortrait extends React.Component<props, any> {

    state = {
        // 粉丝画像的备注信息字数超出
        fansRemarkOverflow: false,
    }

    handleRemarkInput(e){
        const remark = e.target.value.trim();
        if (remark.length <= 150) {
            this.props.updateFansRemark(remark);
            this.setState({fansRemarkOverflow: false});
        } else {
            this.setState({fansRemarkOverflow: true})
        }
    }

    handleTagsClicked(e){
        const tagId = e.target.getAttribute('data-tagid');
        const tagsWrapper = e.target.parentNode;
        const checkType = tagsWrapper.getAttribute('data-checktype');
        const tagsWrapperId = tagsWrapper.getAttribute('data-id');
        const index = this.props.tagsSelected.indexOf(tagId);
        if (index >= 0) {
            const tagsSelected = [...this.props.tagsSelected];
            tagsSelected.splice(index, 1);
            this.props.updateTagsSelected(tagsSelected);
        } else {
            if (checkType === 'single') {
                const tagsSelected = [...this.props.tagsSelected];
                const currentTagsList = this.props.fansTags.filter((tagsContainer) => {
                    return tagsContainer.id == tagsWrapperId
                })[0].items;
                for (let i = 0; i < currentTagsList.length; i++) {
                    const index = this.props.tagsSelected.indexOf(String(currentTagsList[i].itemId));
                    if (index >= 0) {
                        tagsSelected.splice(index, 1);
                        break;
                    }
                }
                this.props.updateTagsSelected([...tagsSelected, tagId]);
            } else {
                this.props.updateTagsSelected([...this.props.tagsSelected, tagId]);
            }
        }
    }

    render() {
        const {
            fansTags = [],
            tagsSelected = [],
            fansRemark = '',
        } = this.props;
        return (
            <section className={styles.fansPortraitContainer}>
                <h1 className={styles.headTip}><span>粉丝画像</span><em>准确的粉丝画像有助于我们向您提供对口的优质课</em></h1>
                <div>
                    {
                        fansTags.map((tag, index) => {
                            return (
                                <div className={classNames({
                                    [styles.portraitIndex]: true, 
                                    [styles.lastPortraitIndex]: index === (fansTags.length - 1)
                                })} key={index}>
                                    <div className={styles.tagsLabel}>
                                        <span>{tag.name}</span>
                                        <em>({tag.checkType === 'multi' ? '多选' : '单选'})</em>
                                    </div>
                                    <div className={styles.tagsWrapper} data-id={tag.id} data-checktype={tag.checkType}>
                                    {
                                        tag.items.map((item, index) => {
                                            return (
                                                <div className={classNames({
                                                    [styles.tag]: true,
                                                    [styles.tagSelected]: tagsSelected.indexOf(String(item.itemId)) >= 0
                                                })} key={index} data-tagid={item.itemId} onClick={this.handleTagsClicked}>{item.itemName}</div>
                                            )
                                        })
                                    }
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className={styles.remark}>
                        <div className={styles.remarkTip}>添加备注</div>
                        <div className={styles.remarkTextarea}>
                            <TextArea placeholder="请输入备注" value={fansRemark} onChange={this.handleRemarkInput} />
                            <span className={classNames({
                                [styles.wordCount]: true,
                                [styles.fansRemarkOverflow]: this.state.fansRemarkOverflow
                            })}>{fansRemark.length} / 150</span>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => ({});

const mapActionToProps = {
    updateFansRemark,
    updateTagsSelected,
}

export default connect(mapStateToProps, mapActionToProps)(FansPortrait);