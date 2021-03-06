import { CONSTANT_COMMONS, CONSTANT_CONFIGS } from '@src/constants';
import { BIG_COINS } from '@src/screens/DexV2/constants';
import PToken from './pToken';

function getNetworkName() {
  let name = 'Unknown';
  const isETH = this?.externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH;
  const isBNB = this?.externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.BNB;
  if (this.isPrivateCoin) {
    name = `${this.name}`;
  } else if (this.isErc20Token) {
    name = 'ERC20';
  } else if (this.isBep2Token) {
    name = 'BEP2';
  } else if (this.isIncognitoToken || this.isMainCrypto) {
    name = 'Incognito';
  }
  let rootNetworkName = name;
  if (isETH || this?.isErc20Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.ETHEREUM;
  } else if (isBNB || this?.isBep2Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.BINANCE;
  }
  return {
    networkName: name,
    rootNetworkName,
  };
}

function combineData(pData, incognitoData, defaultData) {
  if (this.isPToken) {
    return pData;
  }

  if (this.isIncognitoToken) {
    return incognitoData;
  }

  return defaultData;
}

function getIconUrl(chainTokenImageUri) {
  let uri;

  if (this.isMainCrypto || this.isPToken) {
    let formatedSymbol = String(
      this.externalSymbol || this.symbol,
    ).toLowerCase();
    uri = `${CONSTANT_CONFIGS.CRYPTO_ICON_URL}/${formatedSymbol}@2x.png`;
  } else {
    uri = chainTokenImageUri;
  }

  return uri;
}

class SelectedPrivacy {
  constructor(account = {}, token = {}, pTokenData: PToken = {}) {
    const tokenId = pTokenData?.tokenId || token?.id;
    this.currencyType = pTokenData.currencyType;
    this.isToken = tokenId !== CONSTANT_COMMONS.PRV_TOKEN_ID && !!tokenId; // all kind of tokens (private tokens, incognito tokens)
    this.isMainCrypto =
      tokenId === CONSTANT_COMMONS.PRV_TOKEN_ID || !this.isToken; // PRV
    this.isPrivateToken =
      pTokenData?.type === CONSTANT_COMMONS.PRIVATE_TOKEN_TYPE.TOKEN; // ERC20 tokens, BEP2 tokens
    this.isPrivateCoin =
      pTokenData?.type === CONSTANT_COMMONS.PRIVATE_TOKEN_TYPE.COIN; // pETH, pBTC, pTOMO,...
    this.isPToken = !!pTokenData.pSymbol; // pToken is private token (pETH <=> ETH, pBTC <=> BTC, ...)
    this.isIncognitoToken = !this.isPToken && !this.isMainCrypto; // is tokens were issued from users
    this.isErc20Token =
      this.isPrivateToken &&
      this.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20;
    this.isBep2Token =
      this.isPrivateToken &&
      this.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BNB_BEP2;
    this.symbol = combineData.call(
      this,
      pTokenData?.pSymbol,
      token?.symbol,
      CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
    );
    this.name = combineData.call(
      this,
      pTokenData?.name,
      token?.name,
      'Privacy',
    );
    this.displayName = combineData.call(
      this,
      `Privacy ${pTokenData?.symbol}`,
      token?.name,
      'Privacy',
    );
    this.amount = (this.isToken ? token.amount : account.value) || 0;
    this.tokenId = this.isMainCrypto ? CONSTANT_COMMONS.PRV_TOKEN_ID : tokenId;
    this.contractId = pTokenData.contractId;
    this.decimals = this.isMainCrypto
      ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY
      : pTokenData.decimals;
    this.pDecimals = this.isMainCrypto
      ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY
      : pTokenData.pDecimals;
    this.externalSymbol = pTokenData.symbol;
    this.paymentAddress = account.PaymentAddress;
    this.isWithdrawable = this.isPToken;
    this.isDeposable = this.isPToken;
    this.isDecentralized =
      (this.isToken &&
        this.externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH) ||
      this.isErc20Token;
    this.isCentralized = this.isToken && !this.isDecentralized;
    this.incognitoTotalSupply =
      (this.isIncognitoToken && Number(token?.totalSupply)) || 0;
    this.isVerified = combineData.call(
      this,
      pTokenData?.verified,
      token?.verified,
      true,
    ); // PRV always is verified
    this.iconUrl = getIconUrl.call(this, token?.image);
    this.priceUsd = pTokenData?.priceUsd || 0;
    this.change = pTokenData?.change || '0';
    this.pricePrv = pTokenData?.pricePrv || 0;
    this.pairWithPrv = pTokenData?.pairPrv;
    const { networkName, rootNetworkName } = getNetworkName.call(this);
    this.networkName = networkName;
    this.rootNetworkName = rootNetworkName;
    this.isUSDT = this.tokenId === BIG_COINS.USDT;
    this.isPRV = this.tokenId === BIG_COINS.PRV;
  }
}

export default SelectedPrivacy;
