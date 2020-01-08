import { GET_PUBTOPUB_MESSAGE } from '../actions/business-payment-takeincome';

const initState = {
  accountName: "",
  accountNo: "",
  openBank: ""
}

export function businessPaymentTakeincome (state = initState, action) {
  switch (action.type) {
    case GET_PUBTOPUB_MESSAGE:
      const newState = {
        ...state,
        accountName: action.accountName,
        accountNo: action.accountNo,
        openBank: action.openBank
      };
      return newState;
    default:
      return state;
  }
}