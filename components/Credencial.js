 
import React, { useState } from 'react'; 
import { Dimensions,  StyleSheet, Text, View, Image, Button } from 'react-native';  
import { url } from "../config/url_api"; 
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

export default function Credencial ({route, navigation}) {
 
 
  const { 
    numAfiliado, 
    nombrePersona, 
    fingresoAfiliado, 
    documentoPersona, 
    rs_emp,
  } = route.params; 
  
  const [imgPdf417, setimgPdf417] = useState(false); 
   
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

  let soloFecha = fingresoAfiliado.split("T");
  let ordenarFecha = soloFecha[0].split("-"); 
  let fechaIngreso = `${ordenarFecha[2]}/${ordenarFecha[1]}/${ordenarFecha[0]}`;   

   
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  let widthPercent = (windowWidth / 100) * 20;
  let heightPercent = (windowHeight / 100) * 80;
  
  let paddingPercent = (windowWidth / 100) * 11;
  let paddingTextPercent = (windowWidth / 100) * 2;

  // //console.log('----: ' );

  // console.log(`W = ${widthPercent}  `) 
  // console.log(`H = ${heightPercent-heightPercent/10}  `)  
  //console.log(`paddingPercent = ${paddingPercent}%`)  
  //console.log(`paddingTextPercent = ${paddingTextPercent}%`)  

  
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

  




              <Image
                style={{height:widthPercent , width:heightPercent-heightPercent/10}}
                source={require('../assets/images/afi-titular-header.png')}
                />  

              <View style={   {marginTop:paddingTextPercent, marginBottom:paddingTextPercent, marginLeft:paddingTextPercent*3 }    }> 
                <Text style={styles.text} > AFILIADO: {nombrePersona} </Text>
                <Text style={styles.text} > EMPRESA: {rs_emp} </Text>
                <Text style={styles.text} > N॰ DE AFILIADO:  {numAfiliado} </Text>   
                <Text style={styles.text} > F. INGRESO: {fechaIngreso} </Text>
                <Text style={styles.text} > D.N.I: {documentoPersona} </Text>
                
              </View>


              <View style={styles.footer, {marginTop:windowWidth/8}}>
                <Image
                  style={{height:widthPercent, width:heightPercent-heightPercent/10}}
                  source={require('../assets/images/afi-titular-footer.png')}
                  />  
              </View>

            </View>
          </View>
          <View style={styles.ubicacionPdf417}> 
            
                <View style={ {marginRight:windowHeight/3.5,marginBottom:-windowWidth/6} }>  
                  <Text style={styles.textPdf417} > Identificarse: </Text>
                  <Image style={ {width: 178, height: 82} } source={{uri: imgPdf417}}/>
                  {/**
                   * 
                  <Image style={ {width: windowWidth/2.5, height:windowHeight/8} } source={{uri: imgPdf417}}/>
                  */}
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
  containerCard: {
    marginBottom:20,  
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
    fontSize: 12,
    color:'#000',  
    marginTop: 2,  
    marginBottom: 2,  
  },  
  footer: {     
    alignItems: 'center',
    justifyContent: 'center', 
  },  
});

 