import React, { useState, useContext, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Image, FlatList,TouchableOpacity,Alert} from 'react-native';
import { Link } from '@react-navigation/native';


import ScreenTitle from '../components/ScreenTitle';
import WalletInputModal from '../components/WalletInputModal';
import HeaderLogo from '../components/HeaderLogo';
import wallets from '../constants/wallets';
import Colors from '../constants/colors';
import SubmitButton from '../components/Buttons/SubmitButton';

import App from '../screens/App';

import { usePayinfo } from '../context/PayinfoContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
const formatData = (data, numColumns) =>{

    const numberOfFullRows = Math.floor(data.length/numColumns)

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while(numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0){
        data.push({id: `blank-${numberOfElementsLastRow}`, empty: true})
        numberOfElementsLastRow = numberOfElementsLastRow + 1;
    }
    return data;
}
// const BigNumber = require('bignumber.js');

// function convertToHex(value) {
//   if (typeof value !== 'number') {
//     throw new Error('유효하지 않은 입력: 숫자여야 합니다.');
//   }

//   const bigNumber = new BigNumber(value);
//   const hexString = bigNumber.toString(16);
//   return '0x' + hexString;
// }
const SelectWallet = ({navigation}) => {

    // Walletconnect v2.0 사용
    const { isConnected, open, provider } = useWalletConnectModal();
  
    const handleButtonPress = async () => {
      if (isConnected) {
        return provider?.disconnect();
      }
      return open();
    };
  
    const onCopyClipboard = async (value) => {
      setStringAsync(value);
    };

    // v1.0 WC_connector(WalletConnect_connector) 에서 사용할 함수들을 가져옴
    const {
        connectWallet,
        killSession,
        sendTx,
        connector,
    } = WC_connector(navigation,paymentCheck);

    const [payinfo] = usePayinfo();  
    const [state, dispatch] =useContext(AuthContext);
    const [modalIsVisible, setModalIsVisible] = useState(false); 
    const [selectedItem, setSelectedItem] = useState({});
    const [walletlist, setWalletList] = useState([]);
    // const test = ()=>{
    //     console.log(state.wallet.find(e=>e.selected))
    // }
    const paymentCheck = async (transactionhash)=>{
        try{
          const receiptid = await axios({
            method:"POST",
            url:"https://asia-northeast3-nangnang-b59c0.cloudfunctions.net/api/paymentprocess/startsetting",

          })
          console.log("영수증 번호 생성 - ",JSON.stringify(receiptid,null, 2))
        //   const res = await EtherScanAPI.get(`?module=transaction&action=gettxreceiptstatus&txhash=${transactionhash}&apikey=CDFTCSDIJ4HNYU41CJYRP2I3SSCNJ7PGYD`)
        //   console.log('paymentCheck - 거래 결과 ', res.data.status)
        //   console.log('transactionhash 값 ',transactionhash )
        //   const status = res.data.status
          const status = 1
          if(status === "1" || status === 1){
            const walletname =  await state.wallet.find(e => e.selected)
            console.log("결제정보 저장 시에 walletname 확인", walletname)
            try{
                const savepayment = await axios({
                    method:"POST",
                    url:"https://asia-northeast3-nangnang-b59c0.cloudfunctions.net/api/paymentprocess/storepaymentdata",
                    data:{
                        priceAddressInfo_object : {
                            payment_receipt_idx : payinfo.receiptid,
                            seller_id : payinfo.sellerid,
                            consumer_id : state.uid,
                            sender_wallet_address : connector.accounts[0],
                            receiver_wallet_address : payinfo.walletaddress,
                            total_won_price : payinfo.price,
                            total_coin_price : payinfo.exchangedvalue
                        },
                      products: [
                        {
                          product_name: payinfo.product,
                          product_won_price_per: payinfo.price,
                          quantity: 1
                        },
                      ],
                      networkInfo_obejct : {
                        payment_receipt_idx : payinfo.receiptid,
                        main_blockchain_name : "Ethereum",
                        detailed_network_name : "Ethereum Mainnet",
                        detailed_network_real_id_num : 1,
                        payment_wallet_name : walletname
                      }
                    }
                })
                console.log("paymentcheck 결과", JSON.stringify(savepayment,null, 2))
            }catch(e){
                console.log(e)
            }
            navigation.navigate('PayResult')
            //결제 완료 API 저장되어야함
            console.log("결제 완료")
          }else{
            console.log("결제에 오류가 발생했습니다.")
          }
        }catch(e){
          console.log(e)
        }
      } 
    useEffect(()=>{
        setWalletList(wallets);
        return ()=>{

        }
    },[])
    
    const CW =()=>{
        console.log("CW 함수 실행")
        if(payinfo.selectedWalletID === ""){
            Alert.alert("지갑선택", "결제에 사용할 지갑을 먼저 선택해주세요",[
                {
                    text:"네",
                    onPress:()=>null,
                    style:"cancel"
                }
            ])
        }else{
            connectWallet()
        }
    }
    const CloseModalHandler = () => {
        setModalIsVisible(false);
    }

    const handleListItemPress = (item) => {
        setSelectedItem(item)
        setModalIsVisible(true)
    }   
    // var weiAmount = payinfo.exchangedvalue*10**18
    // var hexData = weiAmount.toString(16)
    // sendTx(connector.accounts[0], "0x"+hexData)
    return (
        <View style={styles.MyWalletsView}>
            <View style={styles.header}>
                <Link to={{screen:'Main'}} style={styles.link}>메인으로가기</Link>
                <Text style={{color:'red'}}>사용자 : {state.email}</Text>
                <HeaderLogo />
            </View>
            <View style={styles.title}>
                <ScreenTitle title="지갑 선택" />
            </View>
            <View>
                <SubmitButton onPress={paymentCheck}>결제정보 저장 테스트</SubmitButton>
            </View>
            {!connector.connected && (
                <View style={{flex:1, width:'50%',alignSelf:'center'}}>
                    <SubmitButton onPress={CW}>지갑 연결</SubmitButton>
                </View>
            )}
            {/* 지갑이 연결되어있다면 아래 버튼들을 출력 */}
            {connector.connected && (
                <>
                <Text style={{color : Colors.indigo500,alignSelf:'center'}}> 연결된 지갑 : {payinfo.selectedWallet}</Text>
                <View style={{flex:1, width:'50%',alignSelf:'center'}}>
                    <SubmitButton onPress={killSession}>세션 종료</SubmitButton>
                </View>
                <View style={{flex:1, width:'50%',alignSelf:'center'}}>
                    {/* sendTx(toAccount: string, valueAmount: string) 인데 지금은 toAccount에 연결된 자기자신 지갑주소 넣은거고 valueAmount 값은 위에 만들었고(0x0으로) */}
                    <SubmitButton onPress={() => {
                        console.log("from SelectWallet 돈을 보낼 지갑주소", payinfo.walletaddress)
                        console.log("from SelectWallet 보낼 돈", (payinfo.exchangedvalue*10**18).toString(16))
                        sendTx("0xBC1B146F5C0aa68f76F8E2835A6FAe166Db8f647", 0)
                    }}>거래 전송</SubmitButton>
                </View>
                </>
            )}
            
            <View style={{flex:1, width:'50%',alignSelf:'center'}}>
                    <SubmitButton onPress={() => navigation.navigate('Payinfo')}>결제 정보 확인</SubmitButton>
            </View>
            <View style={styles.WalletBlockView}>
                <FlatList
                    numColumns={2}
                    data={formatData(walletlist,2)}
                    renderItem={({item}) => {
                        if (item.empty === true){
                            return <View style={[styles.WalletBlock, styles.WalletBlockInvisible]}/>
                        }
                        return (
                            <View style={styles.WalletBlock}>
                                <View style={styles.iconwrapper}>
                                    <Image
                                        style={styles.image}
                                        source={item.imageURL} />
                                </View>
                                <Text style={styles.indigo500}>{item.wallet}</Text>
                                <TouchableOpacity 
                                    style={[styles.button,{backgroundColor: item.selected ? '#FF8691' : null}]}
                                    onPress={()=>handleListItemPress(item)}>
                                        <Text style={[styles.indigo500,{ fontSize: 15, alignSelf: 'center' }]}>{item.selected ? '선택됨'  : '결제하기'}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                    keyExtractor={item => item.id}
                    alwaysBounceVertical={false}
                />
            </View>
            <WalletInputModal
                    selecteditem={selectedItem}
                    visible={modalIsVisible}
                    oncancel={CloseModalHandler}
                    walletlist={walletlist}
                    setWalletList={setWalletList}/>
        </View>
    );
};

const styles = StyleSheet.create({
    MyWalletsView: {
        flex: 1,
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    title:{
        flex:1,
        // marginTop:,
    },
    WalletBlockView: {
        flex: 7,
        flexDirection: 'row',
        // justifyContent: 'space-around',
    },
    WalletBlockInvisible:{
        backgroundColor:"transparent"
    },
    WalletBlock: {
        flex:1,
        backgroundColor: '#fff',
        borderRadius: 10,

        width: '40%',
        alignItems: 'center',

        margin:10,
    },
    iconwrapper: {
        margin: '10%',
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        backgroundColor: Colors.backgroundwhite,

        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '70%',
        height: '70%',
        borderRadius: 30
    },
    button: {
        borderColor: Colors.indigo500,
        borderRadius: 20,
        borderWidth: 1,

        alignSelf: 'center',
        margin: '10%',
        marginBottom: '10%',
        paddingVertical: 5,
        paddingHorizontal: 10,
        // width: '100%',
    },
    text:{
        colors: Colors.indigo500,
    },
    link:{
        color: Colors.orange500,
        fontSize:15,
        fontWeight:'bold',
        // borderWidth:1,

        alignSelf:'flex-end', 
        padding: 30,
        marginVertical: 16,
    },
})
export default SelectWallet;