import React, { Component } from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import memmoize from 'memoize-one';
import { connect } from 'react-redux';
import { getEstimateFeeService, getEstimateFeeForSendingTokenService, getEstimateTokenFeeService } from '@src/services/wallet/RpcClientService';
import { CONSTANT_COMMONS } from '@src/constants';
import { accountSeleclor } from '@src/redux/selectors';
import tokenData from '@src/constants/tokenData';
import convertUtil from '@src/utils/convert';
import EstimateFee from './EstimateFee';
import ActivityIndicator from '../core/ActivityIndicator/Component';

class EstimateFeeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultFeeSymbol: null, // which currency use for fee
      minFee: props.initialFee || 0,
      isGettingFee: false,
      estimateErrorMsg: null,
    };

    this.handleEstimateFee = debounce(this.handleEstimateFee.bind(this), 1000);
  }

  componentDidMount() {
    const { selectedPrivacy } = this.props;
    this.setFeeSymbol(selectedPrivacy?.symbol);
  }

  componentDidUpdate(prevProps) {
    const { amount: oldAmount, selectedPrivacy: oldSelectedPrivacy } = prevProps;
    const { amount, selectedPrivacy, toAddress } = this.props;

    if (oldSelectedPrivacy?.symbol !== selectedPrivacy?.symbol) {
      this.setFeeSymbol(selectedPrivacy?.symbol);
    }

    if (oldAmount !== amount && toAddress) {
      this.handleEstimateFee();
    }
  }

  handleEstimateFee = async () => {
    try {
      const { defaultFeeSymbol } = this.state;
      const { selectedPrivacy, amount, toAddress } = this.props;
      let fee;

      if (!amount || !toAddress || !selectedPrivacy || !defaultFeeSymbol) {
        return;
      }

      this.setState({ isGettingFee: true });
  
      // estimate fee in MAIN_CRYPTO_CURRENCY [PRV]
      if (defaultFeeSymbol === tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY) {
        if (selectedPrivacy?.isToken) {
          fee = await this._estimateFeeForToken();
        }
        if (selectedPrivacy?.isMainCrypto) {
          fee = await this._estimateFeeForMainCrypto();
        }
      } else if (defaultFeeSymbol === selectedPrivacy?.symbol) { // estimate fee in pToken [pETH, pBTC, ...]
        fee = await this._handleEstimateTokenFee();
      }
      this.setState({ estimateErrorMsg: null, minFee: fee });

      return fee;
    } catch (e) {
      this.setState({ estimateErrorMsg: 'Can not calculate fee for this transaction, please check again' });
    } finally {
      this.setState({ isGettingFee: false });
    }
  }

  setFeeSymbol = symbol => {
    const { defaultFeeSymbol } = this.state;
    symbol !== defaultFeeSymbol && this.setState({ defaultFeeSymbol: symbol }, this.handleEstimateFee);
  }

  _estimateFeeForMainCrypto = async ()=> {
    try {
      const { account, wallet, selectedPrivacy, toAddress, amount } = this.props;
      const fromAddress = selectedPrivacy?.paymentAddress;
      const accountWallet = wallet.getAccountByName(account?.name);

      if (!selectedPrivacy.amount) throw new Error('Can not estimate fee on zero amount');

      const fee = await getEstimateFeeService(
        fromAddress,
        toAddress,
        convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.symbol),
        account?.PrivateKey,
        accountWallet,
        true // privacy mode
      );
      
      return fee;
    } catch(e){
      throw e;
    }
  }

  _estimateFeeForToken = async () => {
    try{
      const { account, wallet, selectedPrivacy, toAddress, amount } = this.props;
      const fromAddress = selectedPrivacy?.paymentAddress;
      const tokenFee = 0;
      const accountWallet = wallet.getAccountByName(account?.name);
      const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.symbol);
      const tokenObject = {
        Privacy: true,
        TokenID: selectedPrivacy?.tokenId,
        TokenName: selectedPrivacy?.name,
        TokenSymbol: selectedPrivacy?.symbol,
        TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND,
        TokenAmount: originalAmount,
        TokenReceivers: {
          PaymentAddress: toAddress,
          Amount: originalAmount
        }
      };

      if (!selectedPrivacy.amount) throw new Error('Can not estimate fee on zero amount');

      const fee = await getEstimateFeeForSendingTokenService(
        fromAddress,
        toAddress,
        originalAmount,
        tokenObject,
        account?.PrivateKey,
        accountWallet,
        true, // privacy mode
        tokenFee
      );
      
      return fee;
    } catch(e){
      throw e;
    }
  }

  _handleEstimateTokenFee = async () => {
    try{
      const { account, wallet, selectedPrivacy, toAddress, amount } = this.props;
      const fromAddress = selectedPrivacy?.paymentAddress;
      const accountWallet = wallet.getAccountByName(account?.name);
      const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.symbol);
      const tokenObject = {
        Privacy: true,
        TokenID: selectedPrivacy?.tokenId,
        TokenName: selectedPrivacy?.name,
        TokenSymbol: selectedPrivacy?.symbol,
        TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND,
        TokenAmount: originalAmount,
        TokenReceivers: {
          PaymentAddress: toAddress,
          Amount: originalAmount
        }
      };

      if (!selectedPrivacy.amount) throw new Error('Can not estimate fee on zero amount');

      const fee = await getEstimateTokenFeeService(
        fromAddress,
        toAddress,
        originalAmount,
        tokenObject,
        account?.PrivateKey,
        accountWallet,
        true, // privacy mode
      );

      return fee;
    } catch(e){
      throw e;
    }
  }

  handleChangeDefaultSymbol = symbol => {
    this.setFeeSymbol(symbol);
  }

  getFeeSymbolList = memmoize((selectedPrivacy) => {
    const symbols = [tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY];

    if (!symbols.includes(selectedPrivacy?.symbol)) {
      symbols.unshift(selectedPrivacy?.symbol);
    }
    return symbols;
  })

  render() {
    const { minFee, isGettingFee, defaultFeeSymbol, estimateErrorMsg } = this.state;
    const { selectedPrivacy, onSelectFee, finalFee } = this.props;
    const types = this.getFeeSymbolList(selectedPrivacy);

    if (typeof minFee !== 'undefined' && minFee !== null) {
      return (
        <EstimateFee
          onChangeDefaultSymbol={this.handleChangeDefaultSymbol}
          onSelectFee={onSelectFee}
          minFee={minFee}
          finalFee={finalFee}
          types={types}
          defaultFeeSymbol={defaultFeeSymbol}
          isGettingFee={isGettingFee}
          estimateErrorMsg={estimateErrorMsg}
        />
      );
    }

    return <ActivityIndicator />;
  }
}

const mapState = state => ({
  selectedPrivacy: state.selectedPrivacy,
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
});

EstimateFeeContainer.defaultProps = {
  initialFee: null,
  selectedPrivacy: null,
  amount: null,
  toAddress: null,
  finalFee: null,
};

EstimateFeeContainer.propTypes = {
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  finalFee:  PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectedPrivacy: PropTypes.object,
  onSelectFee: PropTypes.func.isRequired,
  initialFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  toAddress: PropTypes.string,
};


export default connect(
  mapState
)(EstimateFeeContainer);