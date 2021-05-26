 
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';  
import { globalStyles } from './styles/global'; 
import { API_URL } from "../config";

export default function changePassword ({ route, navigation }) {

  const [dataUser, setDataUser] = useState({  
    email: ''  ,
  });
  const { email, dni } = dataUser;
  const [validateEmail, setValidateEmail] = useState({  state: true, msg: "" }); 
  const [validateDni, setValidateDni] = useState({  state: true, msg: "" }); 
  const [disabled, setDisabled] = useState(false);

  let clickSend = () => {
    setDisabled(true)
    let _email = email.trim()
    let _dni = dni.trim()
    // Validar EMAIL
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ; 
    if(reg.test(_email) === false) { 
      // Ivalido 
      setValidateEmail({ msg: "Email inválido", state: false })  
      setDisabled(false)

      return null;
    } else { 
      // Valido  
      setValidateEmail({ msg: false, state: true })
    }  

     
    // validar dni
    let regDni = /^-{0,1}\d*\.{0,1}\d+$/ ;
    if(regDni.test(_dni) === false) { 
      // Ivalido
      setValidateDni({ msg: "Dni inválido.", state: false }) 
      setDisabled(false)
      return null;
    } else { 
      // Valido  
      if (_dni.length > 6) { 
        setValidateDni({ msg: false, state: true }) 
      }else{
        // inválido
        setValidateDni({ msg: "Demasiado corto. Ingrese un número válido", state: false }) 
        setDisabled(false)
        return null;

      }
    } 
      
          
    // Post send-email 
    fetch(`http://64.225.47.18:8080/send-email`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'email':_email,'dni':_dni}),
    })
    .then(response => response.json())
    .then(data => {
      //console.log('....?',data.response)
      if(data.response){
        // ok 
        Alert.alert(
          "Enviado correctamente.",
          "Enviamos su nueva contraseña a su email."  
        ); 
        navigation.navigate('Login')
        
      } else {
        // error
        Alert.alert(
          "Usuario no encontrado",
          "Ingrese los datos que utilizó para registrarse."  
        ); 
        setDisabled(false);
      }
      
    })          
    .catch((error) => {
      console.error('Error:', error);
    }); 

  }
 
  return (

    <View style={ globalStyles.container }>  
        
        <Text style={globalStyles.h1}>Cambiar contraseña</Text>
        <Text style={globalStyles.h4}>Ingrese el email con el que se registro.</Text>
        <TextInput  
          style={ globalStyles.inputStyle}
          placeholder="Email"
          maxLength={50}
          value={ email}
          name="email"
          onChangeText={       (email) =>
            setDataUser({
              ...dataUser,
              'email': email,
            })
          } 
          />
        {  validateEmail.state ? null : <Text style={ globalStyles.msgError}> {validateEmail.msg} </Text>}
        <Text style={globalStyles.h4}>Ingrese el dni del usuario.</Text>
        <TextInput  
          style={ globalStyles.inputStyle}
          placeholder="Dni"
          maxLength={9}
          value={ dni}
          name="dni"
          onChangeText={       (dni) =>
            setDataUser({
              ...dataUser,
              'dni': dni,
            })
          } 
          /> 
        
        {  validateDni.state ? null : <Text style={ globalStyles.msgError}> {validateDni.msg} </Text>}

        <View style={ styles.button }>
          <Button 
            disabled={disabled}
            color="#043464" 
            onPress={() => { clickSend() }}  
            title="Enviar"    
          ></Button>
        </View>
        <View style={globalStyles.separator} />
        <View style={globalStyles.separator} />
        <Text style={globalStyles.h4}>Recibira su nueva contraseña via email.</Text>
        <Text style={globalStyles.h6}>Si no lo recibe, revise los spam.</Text>

    </View>
  ); 
    
}
  
const styles = StyleSheet.create({ 
  button: { 
    marginBottom: 10,
    marginTop: 10,
  },  
});

 