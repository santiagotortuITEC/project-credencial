 
import React, { useState } from 'react';
import {  Dimensions,  StyleSheet, Text, View, Image } from 'react-native';  
import { url } from "../config/url_api"; 
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';


export default function Credencial ({route, navigation}) {
 
  const [imgPdf417, setimgPdf417] = useState(null); 

  const { 
    numAfiliado, 
    nombrePersona, 
    fingresoAfiliado, 
    documentoPersona, 
    rs_emp, 
    parentescoAfiliadoflia,
    nombrePersonaTitular
  } = route.params; 
   
  React.useEffect(() => { 
    fetch(`${url}pdf417/${documentoPersona}`).then(response => {
      const contentType = response.headers.get('content-type'); 
      return response.json();
    })
    .then(data => { 
        //console.log('ok------> ',data.response[0]); 
        setimgPdf417(data.response[0]);
    })
    .catch(error => console.error(error),  
    );
  },[])

  // Ordenar fecha
  let soloFecha = fingresoAfiliado.split("T");
  let ordenarFecha = soloFecha[0].split("-"); 
  let fechaIngreso = `${ordenarFecha[2]}/${ordenarFecha[1]}/${ordenarFecha[0]}`;   

  let parentesco = '';

  if (parentescoAfiliadoflia === 'E') {
    parentesco = 'ESPOSA';
  } else if (parentescoAfiliadoflia === 'H') {
    parentesco = 'HIJO';
  } else if (parentescoAfiliadoflia === 'C') {
    parentesco = 'CONCUBINO';
  } else if (parentescoAfiliadoflia === 'N') {
    parentesco = 'NIETO';
  } else {
    parentesco = 'N/D';
  }
   
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  let widthPercent = (windowWidth / 100) * 20;
  let heightPercent = (windowHeight / 100) * 80;
  
  let paddingPercent = (windowWidth / 100) * 11;
  let paddingTextPercent = (windowWidth / 100) * 2;

    // console.log('windowWidth: ', windowWidth/2.5 );
    // console.log('windowHeight: ', windowHeight/8 );

  //console.log(`W = ${windowWidth} - ${widthPercent}%`) 
  //console.log(`H = ${windowHeight} - ${heightPercent}%`)  
  //console.log(`paddingPercent = ${paddingPercent}%`)  
  //console.log(`paddingTextPercent = ${paddingTextPercent}%`)  

  let restante = windowHeight - heightPercent;
 
  /*
  
  TENER EN CUENTA QUE:

  La pantalla va horizontal, por lo tanto en Widht lleva el valor de Height y viceversa.
  
  */ 

  let logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
    console.log('');
    console.log('');
    console.log('-------------');
    console.log('Event: ', event);
    console.log('GestureState: ', gestureState);
    console.log('ZoomableEventObject: ', zoomableViewEventObject);
    console.log('');
    console.log(`Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`);
  }

  const headerImage = require('../assets/images/afi-adherente-header.png');
  const footerImage = require('../assets/images/afi-titular-footer.png');

  return (
 
    <ReactNativeZoomableView
      maxZoom={1.5}
      minZoom={0.5}
      zoomStep={0.5}
      initialZoom={1}
      bindToBorders={true}
      onZoomAfter={()=>logOutZoomState} 
    >

      <View style={ styles.container }>   
      <View style={ {marginTop:0} }>
          <View style={   { height:windowWidth, width:windowHeight },styles.card    }> 

            {headerImage &&
              <Image
                style={{height:widthPercent , width:heightPercent-heightPercent/10}}
                source={headerImage}
              />} 

              <View style={   {marginTop:paddingTextPercent, marginBottom:paddingTextPercent, marginLeft:paddingTextPercent*3 }    }> 
                <Text style={styles.text} > AFILIADO: { nombrePersona } </Text>
                <Text style={styles.text} > AFILIADO TITULAR: {nombrePersonaTitular} </Text>
                <Text style={styles.text} > EMPRESA: {rs_emp} </Text>
                <Text style={styles.text} > F. INGRESO: {fechaIngreso} </Text>
                <Text style={styles.text} > N॰ DE AFILIADO:  {numAfiliado} </Text>   
                <Text style={styles.text} > D.N.I: {documentoPersona} </Text>
                <Text style={styles.text} > PARENTESCO: {parentesco} </Text>
              </View>

              <View style={styles.footer}>
                {footerImage &&
                  <Image
                    style={{height:widthPercent, width:heightPercent-heightPercent/10}}
                    source={footerImage}
                  />}
              </View>
          </View>  
          <View style={styles.ubicacionPdf417}> 
          
                <View style={ {marginLeft:windowWidth/8,marginBottom:-windowWidth/6} }>
                  <Text style={styles.textPdf417} > Identificarse: </Text>
                  {imgPdf417 &&
                    <Image style={ {width: 178, height: 82} } source={{uri: imgPdf417}}/>
                  }
                </View>
                  
                
            </View>
          </View>
      </View>
    </ReactNativeZoomableView>

  ); 
    
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  card: { 
    transform: [{ rotate: '90deg'}],  
    backgroundColor: '#f9f9f9' 
  }, 
  ubicacionPdf417: {  
    transform: [{ rotate: '90deg'}],       
  }, 
  text: { 
    fontSize: 16,
    color:'#000',  
    marginTop: 2,  
    marginBottom: 2,  
  },  
  textPdf417: { 
    fontSize: 9,
    color:'#000',  
    marginTop: 3 ,  
    marginBottom: 0,   
  },  
  footer: {     
    alignItems: 'center',
    justifyContent: 'center',
  },  
});

 