import React  from 'react';
import { StyleSheet, Button, Text, View, Image, Alert  } from 'react-native';
import { globalStyles } from './styles/global';
import { AuthContext } from "./utils";

export default function Home({route, navigation}) { 
     
    const { signOut } = React.useContext(AuthContext); 
  
    const {  
      nombrePersona,  
      nombrePersonaTitular
    } = route.params;
     
    let name = nombrePersona.split(" ");  
    
    const closeSession  = () => {
        Alert.alert('Cerrar sesión', '¿Seguro que desea salir?',
        [
          {text: 'Si', onPress: () => {signOut()} },
                {
                  text: "Cancelar",
                  //onPress: () => this.props.navigation.navigate("nextScreen"), 
                }
        ],
        {cancelable: false}
        ) 
    } 

    return (
        <View style={globalStyles.container}>            
                        
        <View style={styles.localContainer}>
            <Text style={ styles.h1 } > Bienvenido {name[1]}</Text>
            <Image
                style={styles.image }
                source={require('../assets/images/logo.png')}
            />   
        </View>

        <Button
            color="#043464"     
            onPress={() =>  { nombrePersonaTitular ? navigation.navigate('CredencialFlia',route.params) : navigation.navigate('Credencial',route.params) } }
            title="Ver mi credencial"
        /> 
        <View style={styles.separator} />  
        <View style={styles.separator} />
        <Button
            color="#0474D6"   
            onPress={closeSession}
            title="Cerrar sesiÓn"
        /> 
        <View style={styles.separator} />

        </View>
    );
}

const styles = StyleSheet.create({ 
    image: {  
        width: 180,
        height: 123,        
    },  
    localContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column", 
        backgroundColor: '#fff', 
        alignItems: 'center',
    }, 
    separator: {  
        marginBottom: 10,        
    }, 
    h1: {  
      fontSize: 28,
      color:'#043464',
      textAlign: 'center',
      marginTop: 15,  
      marginBottom: 45,
      textTransform: 'capitalize'     
    }, 
  });