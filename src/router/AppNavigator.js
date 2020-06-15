import { THEME } from '@src/styles';
import { createStackNavigator } from 'react-navigation-stack';
import WhySend from '@screens/WhySend';
import WhyReceive from '@screens/WhyReceive';
import pApps from '@screens/Papps';
import DexHistory from '@screens/DexHistory';
import DexHistoryDetail from '@screens/DexHistoryDetail';
import HeaderBar from '@src/components/HeaderBar';
import AddPIN from '@src/screens/AddPIN';
import PriceChartCrypto from '@src/screens/PriceChartCrypto';
import { navigationOptionsHandler } from '@src/utils/router';
import Dex from '@screens/Dex';
import Notification from '@src/screens/Notification';
import NodeHelp from '@screens/NodeHelp';
import BuyNodeScreen from '@screens/BuyNodeScreen';
import StakeHistory from '@screens/StakeHistory';
import StakeRecoverAccount from '@screens/Stake/features/RecoverAccount';
import StakeHistoryDetail from '@screens/StakeHistory/features/Detail';
import PaymentBuyNodeScreen from '@src/screens/PaymentBuyNodeScreen';
import ROUTE_NAMES from './routeNames';
import { getRoutesNoHeader } from './routeNoHeader';

const RouteNoHeader = getRoutesNoHeader();

const AppNavigator = createStackNavigator(
  {
    [ROUTE_NAMES.DexHistory]: navigationOptionsHandler(DexHistory, {
      header: () => null,
    }),
    [ROUTE_NAMES.DexHistoryDetail]: navigationOptionsHandler(DexHistoryDetail, {
      header: () => null,
    }),
    [ROUTE_NAMES.AddPin]: navigationOptionsHandler(AddPIN, {
      header: () => null,
    }),
    [ROUTE_NAMES.Dex]: navigationOptionsHandler(Dex, {
      title: 'pDex',
      header: () => null,
    }),
    [ROUTE_NAMES.Notification]: navigationOptionsHandler(Notification),
    [ROUTE_NAMES.pApps]: navigationOptionsHandler(pApps),
    [ROUTE_NAMES.NodeHelp]: navigationOptionsHandler(NodeHelp, {
      title: 'Need help?',
    }),
    [ROUTE_NAMES.StakeHistory]: navigationOptionsHandler(StakeHistory, {
      title: 'Activities',
    }),
    [ROUTE_NAMES.StakeRecoverAccount]: navigationOptionsHandler(
      StakeRecoverAccount,
      {
        title: 'Recover Account',
      },
    ),
    [ROUTE_NAMES.StakeHistoryDetail]: navigationOptionsHandler(
      StakeHistoryDetail,
      {
        title: 'Activity Detail',
      },
    ),
    [ROUTE_NAMES.WhySend]: navigationOptionsHandler(WhySend, {
      title: 'Send',
    }),
    [ROUTE_NAMES.WhyReceive]: navigationOptionsHandler(WhyReceive, {
      title: 'Receive',
    }),
    [ROUTE_NAMES.BuyNodeScreen]: navigationOptionsHandler(BuyNodeScreen, {
      headerTitleStyle: { alignSelf: 'center' },
      title: 'Buy Node',
    }),
    [ROUTE_NAMES.PriceChartCrypto]: navigationOptionsHandler(PriceChartCrypto, {
      title: 'Price chart',
    }),
    [ROUTE_NAMES.PaymentBuyNodeScreen]: navigationOptionsHandler(
      PaymentBuyNodeScreen,
      { title: 'Payment' },
    ),
    ...RouteNoHeader,
  },
  {
    initialRouteName: ROUTE_NAMES.Home,
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state;
      // You can do whatever you like here to pick the title based on the route name
      const title = routeName;
      return {
        title,
        headerLayoutPreset: 'center',
        header: HeaderBar,
        headerTitleAlign: 'center',
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center' },
        headerBackground: THEME.header.backgroundColor,
        gesturesEnabled: false,
      };
    },
  },
);

export default AppNavigator;
