import * as React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import { updateTagsSelected } from '../../../../actions/portrait';
import styles from './style.scss';

export interface props {
    teamTags: any[];
    tagsSelected: any[];
    updateFansRemark?: (params: string) => void;
    updateTagsSelected?: (params: any[]) => void;
}

@autobind
class TeamStatus extends React.Component<props, any> {
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
                const currentTagsList = this.props.teamTags.filter((tagsContainer) => {
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
            teamTags = [],
            tagsSelected = []
        } = this.props;
        return (
            <section className={styles.teamStatusContainer}>
                <h1 className={styles.headTip}><span>团队现状</span></h1>
                <div>
                    {
                        teamTags.map((tag, index) => {
                            return (
                                <div className={classNames({
                                    [styles.portraitIndex]: true,
                                    [styles.lastPortraitIndex]: index === (teamTags.length - 1)
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
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => ({});

const mapActionToProps = {
    updateTagsSelected
}

export default connect(mapStateToProps, mapActionToProps)(TeamStatus);