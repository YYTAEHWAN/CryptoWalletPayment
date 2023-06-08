import React,  {useContext} from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';

import Login from '../screens/Login';
import Main from '../screens/Main';
import SelectWallet from '../screens/SelectWallet';
import Register from '../screens/Register';
import MyWallets from '../screens/MyWallets';
import QRCodeScanner from '../screens/QRCodeScanner';
import Payinfo from '../screens/Payinfo';
import PayResult from '../screens/PayResult';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

export function Auth() {
  return (
    <AuthStack.Navigator initialRouteName={'Login'} screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  )
}

export function Home (){
  return (
    <MainStack.Navigator initialRouteName={'Main'} screenOptions={{headerShown: false}}>
      <MainStack.Screen name="Main" component={Main} />
      <MainStack.Screen name="SelectWallet" component={SelectWallet}/>
      <MainStack.Screen name="Payinfo" component={Payinfo}/>
      <MainStack.Screen name="QRCodeScanner" component={QRCodeScanner}/>
      <MainStack.Screen name="MyWallets" component={MyWallets}/>
    </MainStack.Navigator>
  )
}

function Navigator() {
  const [state] = useContext(AuthContext);
  console.log('user_login',state);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'route'}  screenOptions={{headerShown: false}}>
        <Stack.Screen name="route" component={state.isLogin ? Home : Auth}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigator