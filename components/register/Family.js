 
import React, { useState } from 'react';
import { StyleSheet, Dimensions,Text, View,  ScrollView, Button, ViewBase } from 'react-native';  
import { globalStyles } from '../styles/global'; 
import { Picker as SelectPicker } from '@react-native-picker/picker';

export default function Family ({ route, navigation }) { 
  
    // Estados
    const [parentesco, setparentesco] =  useState('A');  
    const [msgErrorParentesco, setmsgErrorParentesco] = useState({  state: false, msg: "" }); 

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    // Click continuar
    let clickContinue = () => {
         
        if (parentesco === 'A' || parentesco === 'B' ) {
            navigation.navigate('Escanear',{parentesco: parentesco})
            // MODO DESARROLLO - Debe redireccionar al Sacaneo
            //navigation.navigate('Register',{parentesco: parentesco, sexoScan: 'M', fnacScan: '03-05-200', nombreScan: 'SANTIAGO', apellidoScan: 'TORTU', dniScan: 42400448, cuilScan:20424004481 })
        } else {   
            setmsgErrorParentesco({state:true, msg:'Debe seleccionar una opción.'})
            return null;
        }
          
    }

    // Vista
    return (
        <View style= {globalStyles.container}>  
            <ScrollView>               

              <Text style={ globalStyles.h1 } > Registrarte </Text>

              <Text style={ globalStyles.h4 }>Se registrara como: </Text>        
              <SelectPicker
                selectedValue={parentesco}
                style={globalStyles.inputStyle}
                onValueChange={(itemValue) =>
                  setparentesco(itemValue)
                }>
                <SelectPicker.Item label="Afiliado titular" value="A" />
                <SelectPicker.Item label="Familiar del afiliado" value="B" />
              </SelectPicker>
  
                {  msgErrorParentesco.state ? <Text style= {globalStyles.msgError}> {msgErrorParentesco.msg} </Text> : null}
                  
                <Text style= {styles.margin}></Text>
                
                 
            </ScrollView>
            <View style={globalStyles.buttonPosition}> 
              <Button                                     
                onPress={() => { clickContinue() }}                      
                title='Continuar'
                color='#043464'
                > </Button>
            </View>
        </View>
    ); 
    
}
  
const styles = StyleSheet.create({
   
  margin: {
    marginTop: 20, 
  },  
});