import * as React from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import {AuthContext}  from "./components/utils"; 
// Stack
import Credencial from "./components/Credencial";
import CredencialFlia from './components/CredencialFlia';
import Home from './components/Home';
// AuthScreen
import  Login from "./components/Login";
import  Register from "./components/register/Register";
import  Family from "./components/register/Family";
import  Scanner from "./components/register/Scanner";
import  PreRegister from "./components/register/PreRegister";
import  ChangePassword from "./components/ChangePassword";
//
//import  SplashScreen from './components/SplashScreen'

const StackAuth = createStackNavigator();  
const Stack = createStackNavigator(); 

function AuthStack({route}) {
  
  return (

    <StackAuth.Navigator initialRouteName={route.params ? 'Home' : 'Login'}>
              {/*  Logged   */}
      { route.params ? 
      <> 
        <StackAuth.Screen name="Home" initialParams={route.params} component={Home} options={{title:'Inicio'}} /> 
        <StackAuth.Screen name="Credencial" component={Credencial}                  options={{title:'Tu credencial'}} /> 
        <StackAuth.Screen name="CredencialFlia" component={CredencialFlia}          options={{title:'Tu credencial'}} /> 
      </>
      :
      <>
              {/*  Auth   */}
        <StackAuth.Screen name="Login" component={Login}                     options={{title:'Bienvenido'}} /> 
        <StackAuth.Screen name="Register" component={Register}               options={{title:'Registrarte'}} /> 
        <StackAuth.Screen name="Family" component={Family}                   options={{title:''}} /> 
        <StackAuth.Screen name="Scanner" component={Scanner}                 options={{title:'Escaneo de DNI'}} /> 
        <StackAuth.Screen name="Escanear" component={PreRegister}            options={{title:''}} /> 
        <StackAuth.Screen name="ChangePassword" component={ChangePassword}   options={{title:''}} /> 
      </>
      }

    </StackAuth.Navigator>
  );
}

 

export default function App({ navigation }) {
 

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('veces')
      if(value) {
        return value;
      } else {
        return 0;
      }
    } catch(e) {
      console.log('error en APP : ')

    }
  }

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('veces', value.toString())
      //console.log('Bien 'veces':')

    } catch (e) {
      // saving error
      //console.log('Error en 'veces':')
    }
  }

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          if (action.token) {
            AsyncStorage.setItem('userToken',action.token);
          }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          AsyncStorage.removeItem('userToken');
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken'); 
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      let veces = await getData();
      storeData(Number(veces)+1);
      console.log('veces: ',veces);
      if (veces > 9) {
        authContext.signOut();
        storeData(0);
      }else{
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        //console.log('SignIn Data: ',data)

        dispatch({ type: 'SIGN_IN', token: JSON.stringify(data) });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
        <NavigationContainer>   
          <Stack.Navigator>  
            {state.userToken === 'dummy-auth-token' ?               
              <Stack.Screen options={{headerShown: false }} name="Login" component={AuthStack} />             
            : 
            <>
              { state.userToken !== null ? (
                <>
                    <Stack.Screen options={{headerShown: false }} initialParams={JSON.parse(state.userToken)} name="Home" component={AuthStack} />
                </>
                ) : (
                  <Stack.Screen options={{headerShown: false }} name="Login" component={AuthStack} />  

              )}
            </>
            }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}