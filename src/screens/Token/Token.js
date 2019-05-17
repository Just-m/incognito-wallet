import React from 'react';
import TokenTabs from './TokenTabs';
import { ScrollView, Button } from '@src/components/core';
import Account from '@src/services/wallet/accountService';
import ROUTE_NAMES from '@src/router/routeNames';
import PropTypes from 'prop-types';

class Token extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listNormalTokens: [],
      listPrivacyTokens: [],
    };

    this.tab = null;
  }

  loadFollowingTokens = async () => {
    const { account, wallet } = this.props;
    const followingTokens = await Account.getFollowingTokens(account, wallet);

    this.setState({
      listNormalTokens: followingTokens.filter(token => !token.IsPrivacy),
      listPrivacyTokens: followingTokens.filter(token => token.IsPrivacy),
    });
  }

  // getBalanceToken = async () => {

  // }

  componentDidMount(){
    this.loadFollowingTokens();
  }

  componentDidUpdate(prevProps) {
    if (this.shouldReloadListToken(prevProps)) {
      this.loadFollowingTokens();
    }
  }

  shouldReloadListToken = prevProps => this.props.account.name !== prevProps.account.name || this.props.wallet !== prevProps.wallet;

  handleInitToken = () => {
    const { navigation } = this.props;

    let isPrivacy = false;
    const key = this.tab?.getCurrentTabKey();
    if ( key === 'privacy'){
      isPrivacy = true;
    }

    navigation.navigate( 
      ROUTE_NAMES.CreateSendToken, 
      {isPrivacy, isCreate: true, reloadListFollowToken: this.loadFollowingTokens}
    );
  }

  handleAddFollowingTokens = () => {
    const { navigation } = this.props;
    let isPrivacy = false;
    const key = this.tab?.getCurrentTabKey();

    if ( key === 'privacy'){
      isPrivacy = true;
    }

    navigation.navigate(ROUTE_NAMES.FollowToken, { isPrivacy });
  }


  render(){
    const { listNormalTokens, listPrivacyTokens } = this.state;
    const { navigation, account, wallet } = this.props;

    const accountWallet = wallet.getAccountByName(account.name);

    return (
      <ScrollView>
        <TokenTabs 
          listNormalTokens={listNormalTokens} 
          listPrivacyTokens={listPrivacyTokens} 
          tabRef={ tab => this.tab = tab } 
          navigation={navigation} 
          accountWallet={accountWallet}
        />
    
        <Button title='INIT NEW TOKEN' onPress={this.handleInitToken}></Button>
        <Button title='ADD TOKENS TO FOLLOW' onPress={this.handleAddFollowingTokens}></Button>
      </ScrollView>
    );
  }

}

Token.propTypes = {
  account: PropTypes.object,
  wallet: PropTypes.object,
  navigation: PropTypes.object,
};

export default Token;