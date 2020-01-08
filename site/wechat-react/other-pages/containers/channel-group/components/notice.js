import React from 'react';
import PropTypes from 'prop-types';

const Notice = props => {
    return (
        <section className='notice-container last-pd' {...props}>
            <header className="icon_enter">
                <span className='verticle-line'></span>
                拼课须知
            </header>
            {
	            props.type === 'a' &&
                <div className="group-notice">
                    <div className="flow">
                        ①开团或购买拼课
                        <div className="arrow"></div>
                        ②分享拼课给好友
                        <div className="arrow"></div>
                        ③进入听课
                    </div>
                </div>
            }
            {
	            props.type === 'b' &&
                <div className="group-notice">
                    <div className="flow">
                        ①开团并邀请好友拼课
                        <div className="arrow"></div>
                        ②人满即可听课，不满不可听课
                    </div>
                </div>
            }
        </section>
    );
};

Notice.propTypes = {
    type: PropTypes.oneOf(['a', 'b'])
};

export default Notice;
