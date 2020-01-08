/**
 * Created by dylanssg on 2017/9/26.
 */

import { getUrlParams } from 'components/url-utils';

let sourceKey = typeof window !== 'undefined' ? getUrlParams('sourceKey') : '';
if(sourceKey === 'null' || sourceKey === 'undefined'){
	sourceKey = ''
}

if(!sourceKey && typeof sessionStorage !== 'undefined'){
	sourceKey = sessionStorage.getItem('sourceKey');
	if(sourceKey){
		sessionStorage.setItem('sourceKey', sourceKey);
	}
}else if(typeof sessionStorage !== 'undefined'){
	sessionStorage.setItem('sourceKey', sourceKey);
}

export default sourceKey;