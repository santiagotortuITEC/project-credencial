

import React,  { useState, useEffect }  from 'react';
import { Dimensions, Button, Text, View ,StyleSheet} from 'react-native'; 
import { BarCodeScanner } from 'expo-barcode-scanner'; 
import config from "../../config";

const { width } = Dimensions.get('window');

export default function Scanner({ route,navigation }) {  

  const { parentesco } = route.params;

  // Cuil
  const getCUIT = (gender, dni) => {
        
    console.log('dni: ',dni);
    dni = String(dni);
    console.log('dni largo: ',dni.length);

    if (!dni || dni.length !== 8) {
       return alert('Algo anduvo mal');
    }
  
    let genderNumber = gender === 'M' ? 20 : 27;
  
    const generateDigitVerificator = () => {
      const multipliers = [2, 3, 4, 5, 6, 7];
      const genderNumberAndDNI = `${genderNumber}${dni}`;
  
      let total = 0;
      let multipliersIndex = 0;
      for (let i = String(genderNumberAndDNI).length - 1; i > -1; i--) {
        const sum = genderNumberAndDNI[i] * multipliers[multipliersIndex];
        total += sum;
        if (multipliersIndex === 5) multipliersIndex = 0;
        else multipliersIndex += 1;
      }
  
      const digitVerificator = 11 - (total % 11);
  
      if (digitVerificator === 10) {
        genderNumber = 23;
        return generateDigitVerificator();
      }
      if (digitVerificator === 11) return 0;
      return digitVerificator;
    };
  
    const digitVerificator = generateDigitVerificator();
  
    return `${genderNumber}-${dni}-${digitVerificator}`;
  };



    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
 
    // Para separar al string que recibo
    let elements = data.split("@");
    console.log('elements: ', elements)
    let dni,apellido,nombre,fnac,sexo = '';
    if (elements.length > 1) {      
      if (data[0] == '@') {
        // Dni mas antiguo
        dni = elements[1].trim();
        apellido = elements[4].trim();
        nombre = elements[5].trim(); 
        fnac = elements[7].trim();
        sexo = elements[8].trim();
      }else{
        // Dni mas reciente
        dni = elements[4].trim();
        apellido = elements[1].trim();
        nombre = elements[2].trim(); 
        fnac = elements[6].trim();
        sexo = elements[3].trim();
      }
    }
    // Discriminar a los que no sean pdf417. Un QR por ejemplo
    if (type == 2048) {  
      let cuilScan = getCUIT(sexo,dni);
      // Comparar que el DNI del escaneo sea un AFILIADO ACTIVO 
      fetch(`http://192.168.0.7:3000/usuarios/${dni}`).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Algo anduvo mal.');
        }
      })
      .then((responseJson) => { 
        //alert('Ya puedes registrarte.')
        navigation.navigate('Register',{parentesco:parentesco, sexoScan: sexo, fnacScan: fnac, nombreScan: nombre, apellidoScan: apellido, dniScan: dni, cuilScan: cuilScan })
        // Redireccionar a Form Registracion 
      })
      .catch((error) => {
        console.log(error)
        alert('Inhabilitado.') 
        console.log(config.API_URL)
        //  navigation.navigate('Inicio')
        // Redireccionar a Inicio
      });
          
      }else{
        alert('No se ha identificado un DNI.');
      }
  
  };

  if (hasPermission === null) {
    return <Text>Esperando permiso a la camara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No hay acceso a la camara.</Text>;
  } 
  return (
 
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >       
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
      </BarCodeScanner>
      
      {scanned && <Button title={'Toca para escanear nuevamente.'} onPress={() => setScanned(false)} />}
    </View>

  )
}
 
const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    //justifyContent: 'center',
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity
  },
});