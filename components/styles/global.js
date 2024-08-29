import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      //justifyContent: "center",
      padding: 35,
      marginTop: -15,
      backgroundColor: '#fff'
    },
    inputStyle: {
      width: '100%',
      marginBottom: 15,
      paddingBottom: 5,
      alignSelf: "center",
      borderColor: "#ccc",
      borderBottomWidth: 1
    }, 
    msgError: {
      color: 'red',
      marginBottom: 10, 
      marginTop: -10,
      fontSize: 12, 
    },
    preloader: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff'
    },
    button: {
      width: 300,
      height: 40,
      marginTop: 10,   
    },  
    buttonText: {     
      color: '#043464', 
      marginTop: 15,
      //marginBottom: 15,
      textAlign: "center"
    }, 
    h1: {      
      fontSize: 28,
      color:'#043464',
      textAlign: 'center',
      marginTop: 15,  
      marginBottom: 45, 
    },
    h4: {      
      fontSize: 16,
      color:'#043464', 
      marginTop: 5,  
      marginBottom: 5, 
    },
    h6: {      
      fontSize: 12,
      color:'#043464', 
      marginTop: 0,  
      marginBottom: 1, 
    },
    inline: { 
      alignSelf: "center",
      borderColor: "#ccc",
      borderBottomWidth: 1,
      width: '80%', 
      marginBottom: 15,
      marginTop:15
    },
    inputUsername: {  
      width: '100%',
      marginBottom: 15,
      paddingBottom: 5,
      alignSelf: "center",
      borderColor: "#ccc",
      borderBottomWidth: 1, 
    }, 
    separator: {
      marginTop: 15
    },
    buttonPosition: {
      marginBottom: 25
    },
    buttonLoginContainer: {
      width: '100%',
      height: 40,
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: '#043464',
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center'
    },
    buttonLoginContainerDisabled: {
      width: '100%',
      height: 40,
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: '#ccc',
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center'
    },
    buttonLoginText: {
      color: '#fff',
      fontSize: 15
    },
  });
 