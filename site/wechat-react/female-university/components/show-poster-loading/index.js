import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import PortalCom from '../portal-com'

function ShowPosterLoading({ decs, isCheck }) {
    return (
        <>
            <PortalCom className="poster-loading-container" >
                <div className="poster-loading-center">
                    <div className="loading-pic"></div>
                    { isCheck && <div className="loading-desc">内容发布成功</div> }
                    <div className="loading-sub-desc">{ decs ? decs : '正在为你生成打卡海报'}...</div>
                </div>
            </PortalCom>
        </>
  );
}
export default ShowPosterLoading