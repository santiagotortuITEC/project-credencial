 
import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Text, View, TextInput, ScrollView, TouchableHighlight, Alert, TouchableOpacity} from 'react-native';  
import { globalStyles } from './styles/global'; 
import { AuthContext } from "./utils";
import AsyncStorage from '@react-native-async-storage/async-storage';  
import { url } from "../config/url_api"; 
import ToggleSwitch from "toggle-switch-react-native";

export default function Login({ navigation }) {  
  const { signIn } = React.useContext(AuthContext);
  
  const storeData = async (value) => {
    let infoLogin = {    
      username: username,
      password: password,      
    }
    try {
      await AsyncStorage.setItem('veces', value.toString()) 

      if (rememberMe) {
        AsyncStorage.setItem('infoLogin', JSON.stringify(infoLogin)) 
      } else {
        AsyncStorage.setItem('infoLogin', '') 
      }
  
    } catch (e) {
      //console.log('Error AsyncStorage:')
    }
  }
  
  const [dataUser, setDataUser] = useState({    
    username: '',
    password: '',      
  }); 
  const [rememberMe, setRememberMe] = useState(true);

  const [validateUsername, setValidateUsername] = useState(true);
  const [validatePassword, setValidatePassword] = useState(true); 

  const [isLoading, setIsLoading] = useState(false); 

  const [validateAll, setValidateAll] =  useState({  state: false, msg: "" });   
  
  let loginButtonStyles = isLoading ? globalStyles.buttonLoginContainerDisabled : globalStyles.buttonLoginContainer;
  
  useEffect(()=>{ 
    getUsernameAsyncStorage();
  },[]) 

  const getUsernameAsyncStorage = async () => {
    await AsyncStorage.getItem('infoLogin').then(
      (dataLogin) =>  
        dataLogin ?          
          setDataUser({ 
            'username': JSON.parse(dataLogin).username,
            'password': JSON.parse(dataLogin).password
          })
        : null
    ); 
  }; 
 

  const checkIfUserIsActive = async (username) => {
    try {
      const response = await fetch(`${url}afiliadoactivo/${username}`);
      console.log('response: ', response);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Error verificando el usuario activo');
      }
  
      return data.response;
    } catch (error) {
      setValidateAll({ state: false, msg: "Ha ocurrido un problema" });
      throw error;
    }
  };
  
  const sendLogin = async () => {
    try {
      const response = await fetch(`${url}login/${username}/${password}`);
      console.log('Response received:', response);
  
      const contentType = response.headers.get('content-type');
      if (!contentType) {
        throw new TypeError("Oops, we haven't got a valid content type!");
      }  
  
      const data = await response.text();
      const dataParsed = data ? JSON.parse(data) : {};
      
      if (dataParsed.response.length === 1) {
        setValidateAll({ state: false, msg: dataParsed.response[0] });
      } else {
        signIn(dataParsed.response[1][0]);
        storeData(0, username, password);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setValidateAll({ state: false, msg: "Ha ocurrido un error" });
    }
  };
  
  const clickSend = async () => {
    // Validaciones
    if (!username?.trim() || !password?.trim()) {
      setValidateUsername(false);
      setValidatePassword(false);
      setValidateAll({ state: false, msg: "Hay campos incorrectos." });
      return;
    }
  
    setValidateAll({ state: true, msg: false });
    setIsLoading(true);
  
    try {
      const isActive = await checkIfUserIsActive(username);
  
      if (isActive) {
        // Sigue activo, puede ingresar
        await sendLogin();
      } else {
        Alert.alert(
          "Atención",
          "No se ha encontrado ningún afiliado activo vinculado al usuario ingresado."
        );
      }
    } catch (error) {
      setValidateAll({ state: false, msg: "Ha ocurrido un problema." });
    } finally {
      setIsLoading(false);
    }
  };

  const { 
    username,
    password,  
  } = dataUser;
 
    
    return (
      <View style={ globalStyles.container}>  
      

      <ScrollView>
  
      <Text style={ globalStyles.h1 } > Iniciar sesión </Text>


      <TextInput  
        autoCapitalize='none'
        style={ globalStyles.inputUsername}
        placeholder="Nombre de usuario"
        maxLength={20}
        value={ username}
        name="username" 
        onChangeText={       (username) =>
          setDataUser({
            ...dataUser,
            'username': username,
          })
        }
      /> 
 
      {  validateUsername ? null : <Text style={ globalStyles.msgError}>Usuario no registrado</Text>}
      
      <TextInput
        autoCapitalize='none'
        style={ globalStyles.inputStyle}
        placeholder="Contraseña"
        value={ password}
        maxLength={15}
        secureTextEntry={true}
        name="password" 
        onChangeText={       (password) =>
          setDataUser({
            ...dataUser,
            'password': password,
          })
        }
        
        />
      {  validatePassword ? null : <Text style={ globalStyles.msgError}>Contraseña inválida</Text>}
      {  validateAll.state ? null : <Text style={ globalStyles.msgError}>{validateAll.msg}</Text>}
 
     
 
      <View style={styles.containerSwitch}>         
        <ToggleSwitch
            label="Recordar mis datos"
            isOn={rememberMe}
            onToggle={(value) => setRememberMe(value)}
            onColor="#0474D4"
            offColor="gray" 
            labelStyle={{ color: "#043464", fontWeight: "600" }}
            size="small"
          />
      </View>


      <TouchableOpacity 
        onPress={() => clickSend()} 
        disabled={isLoading}
        style={loginButtonStyles}>
        <Text style={globalStyles.buttonLoginText}> 
          {isLoading ? "Ingresando..." : "Ingresar"} 
        </Text>
      </TouchableOpacity>

      <TouchableHighlight
        onPress={() => navigation.navigate('ChangePassword')}
        >
        <Text style={ globalStyles.buttonText} >¿Has olvidado la contraseña?</Text>
      </TouchableHighlight>

      <View style={globalStyles.separator} />

      <Text style={globalStyles.inline}>  </Text>
      <View style={styles.separator} />
  
       
      <View style={globalStyles.buttonPosition}> 
        <Button 
          style={ styles.buttonSmall }
          onPress={() => navigation.navigate('Family')}
          title='Crear nueva cuenta'
          color='#0474D4'
          > </Button>
        </View>
    
    </ScrollView>
  </View>
  ) 




   
}

const styles = StyleSheet.create({  
  separator: {
      marginTop: 15
  },
  containerSwitch: {
    marginBottom: 22,
    marginTop: -4,
    marginLeft: -10
   },
});