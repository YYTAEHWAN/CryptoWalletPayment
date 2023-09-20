import React ,{useState,useEffect, } from 'react';
import {View,StyleSheet,Text,Button,Dimensions} from 'react-native';
import { BarCodeScanner} from 'expo-barcode-scanner';

import {  usePayinfo } from '../context/PayinfoContext';

const {width} = Dimensions.get('window')

function QRCodeScanner ({navigation, connector, connectWallet}){
  const [hasPermission, setHasPermission] = useState(null); 
  const [scanData, setScanData] = useState(false);
  const [_, setPayinfo] = usePayinfo();


  useEffect(()=>{(async()=>{
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  },[]);

  const handlerBarCodeScanned = ({type, data})=>{
    console.log("QR 코드 데이터 확인",data)
    var arrdata = data.split(',')
    
    const Payinfo ={
      inpayment : true,
      product_name: arrdata[1],
      price: parseInt(arrdata[2]),
      wallet: arrdata[4],
      walletaddress: "0x437782D686Bcf5e1D4bF1640E4c363Ab70024FBC",
      receiptid : arrdata[6],
      sellerid: arrdata[7],
      selectedWalletID:"",
      selectedWallet:"",
      exchangedvalue: 0,
      mywalletaddress: "",
      ticker : "",
      isConnected : false,
    }
    if(data){
      setScanData(true);
      setPayinfo(Payinfo);
      navigation.navigate('SelectWallet');
    }
    else{
      console.log(`Type: ${type}`);
      setScanData(false)
    }
  } 
  if(hasPermission===null){
    return (
        <Text>카메라 권한을 확인해주세요</Text>
    )
  }
  if(hasPermission === false){
    return (
      <View style={styles.container}>
      <Text>NO Access to Camera</Text>
      <View style={styles.footer}>
        <Button onPress={() => navigation.navigate('Main')} title="뒤로가기"/>
      </View>
      </View>
      
    )
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={[StyleSheet.absoluteFill, styles.qrcode]}
        onBarCodeScanned={scanData ? undefined : handlerBarCodeScanned}>
          <Text style={styles.description}>Scan your QR code</Text>
      </BarCodeScanner>
      {scanData && 
        <Button style={{margin:200}} title="Scan Again?" onPress={()=> setScanData(false)}/>}
      <View style={styles.footer}>
        <Button onPress={() => navigation.navigate('Main')} title="뒤로가기"/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container :{
    flex:1,
    backgroundColor:'#fff',
    // alignItems:'center',
    flexDirection:'column',
    justifyContent:'flex-end',
  },

  qrcode:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },

  footer:{
    flex:1,
    // flexDirection:'row',
    justifyContent:'flex-end',
    alignSelf:'center',
    marginBottom: 20,
  },

  description: {
    fontSize: width * 0.09,
    marginTop: '10%',
    textAlign: 'center',
    // alignItems:'flex-start',
    width: '70%',
    color: 'white',
  },
})
export default QRCodeScanner;

