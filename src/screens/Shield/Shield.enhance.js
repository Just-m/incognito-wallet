import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import withTokenSelect from '@src/components/TokenSelect/TokenSelect.enhance';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { ExHandler } from '@src/services/exception';
import PropTypes from 'prop-types';
import { withTokenVerified } from '@src/components/Token';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { actionFetch as fetchDataShield } from './Shield.actions';

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { allTokens, isTokenSelectable } = props;
  const getPrivacyDataByTokenID = useSelector(
    selectedPrivacySeleclor.getPrivacyDataByTokenID,
  );
  const availableTokens = allTokens
    .map((token) => getPrivacyDataByTokenID(token?.tokenId))
    .filter((token) => token?.isDeposable);
  const handleWhyShield = () => navigation.navigate(routeNames.WhyShield);
  const handleShield = async (tokenId) => {
    try {
      if (!isTokenSelectable(tokenId)) {
        return;
      }
      navigation.navigate(routeNames.ShieldGenQRCode);
      await dispatch(fetchDataShield({ tokenId }));
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          availableTokens,
          handleWhyShield,
          handleShield,
        }}
      />
    </ErrorBoundary>
  );
};

enhance.propTypes = {
  allTokens: PropTypes.array.isRequired,
};
export default compose(
  withLayout_2,
  (Comp) => (props) => <Comp {...{ ...props, onlyPToken: true }} />,
  withTokenSelect,
  enhance,
  withTokenVerified,
);
