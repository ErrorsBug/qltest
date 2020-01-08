function toast(msg){
    wx.showToast({
        title: msg,
    });
}

/**
 * @param {string} validType - 检验类型
 * @param {string} typeName - 提示标题
 * @param {string | number} inputVal - 检验值
 * @param {number} maxNum - 最大值
 * @param {number} minNum - 最小值
 */
export const validator = function (validType, typeName, inputVal, maxNum, minNum) {
	var inputVal = inputVal.trim();
	var pass = true;
	if (inputVal === '') {
		toast(typeName + '不能为空');
		return false;
	};
	switch (validType) {
		case 'text': 		pass = checkText(); 		break;
		case 'money': 		pass = checkMoney(); 		break;
		case 'name': 		pass = checkName(); 		break;
		case 'password': 	pass = checkPassword(); 	break;
		case 'wxAccount': 	pass = checkWxAccount(); 	break;
		case 'phoneNum': 	pass = checkPhoneNum(); 	break;
	};
	function checkText() {
		if (maxNum && inputVal.length > maxNum) {
			toast(typeName + '不能超过' + maxNum + '个字');
			return false;
		}
		return true;
	};
	function checkMoney() {
		if (!/(^[0-9]*[\.]?[0-9]{0,2}$)/.test(inputVal)) {
			toast(typeName + '必须为非负数字,最多2位小数');
			return false;
		}
		if (maxNum && Number(inputVal) > maxNum) {
			toast(typeName + '不能超过' + maxNum + '元');
			return false;
		}
		if (minNum && Number(inputVal) < minNum) {
			toast(typeName + '不能小于' + minNum + '元');
			return false;
		}
		return true;
	};
	function checkName() {
		if (!/(^[a-zA-Z]+$)|(^[\u4e00-\u9fa5]+$)/.test(inputVal)) {
			toast('请输入真实姓名');
			return false;
		}
		if (maxNum && inputVal.length > maxNum) {
			toast(typeName + '不能超过' + maxNum + '个字');
			return false;
		}
		return true;
	};
	function checkPassword() {
		if (!/^[0-9a-zA-Z]+$/.test(inputVal)) {
			toast(typeName + '只能是数字与字母组成');
			return false;
		}
		if (maxNum && inputVal.length > maxNum) {
			toast(typeName + '最长为' + maxNum + '位');
			return false;
		}
		return true;
	};
	function checkWxAccount() {
		if (!/^[0-9a-zA-Z\-\_]{5,30}$/.test(inputVal)) {
			toast('微信号仅6~30个字母，数字，下划线或减号组成');
			return false;
		}
		return true;
	};
	function checkPhoneNum() {
		if (!/^1[3|4|5|7|8]\d{9}$/.test(inputVal)) {
			toast('请输入正确的手机号');
			return false;
		}
		return true;
	};
	return pass;
};
