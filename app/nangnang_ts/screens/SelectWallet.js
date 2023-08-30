
import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Image, FlatList,TouchableOpacity,Alert,Pressable} from 'react-native';
import { Link } from '@react-navigation/native';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';

import ScreenTitle from '../components/ScreenTitle';
import WalletInputModal from '../components/WalletInputModal';
import HeaderLogo from '../components/HeaderLogo';
import wallets from '../constants/wallets';
import Colors from '../constants/colors';
import SubmitButton from '../components/Buttons/SubmitButton';
import { usePayinfo } from '../context/PayinfoContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import WalletButton from '../components/Buttons/WalletButton';

// https://github.com/ethers-io/ethers.js/issues/3996 이거 보고 추가함
import 'node-libs-react-native/globals';

// 암호화 getRandomValues ​​shim 가져오기(**shim 이전**)
import "react-native-get-random-values" //

// ethers shim 가져오기(**ethers 이전**)
import "@ethersproject/shims"

// 에테르 라이브러리 가져오기
import { ethers } from "ethers";


const goerliapi = "CDFTCSDIJ4HNYU41CJYRP2I3SSCNJ7PGYD"
const formatData = (data, numColumns) =>{

    const numberOfFullRows = Math.floor(data.length/numColumns)

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while(numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0){
        data.push({id: `blank-${numberOfElementsLastRow}`, empty: true})
        numberOfElementsLastRow = numberOfElementsLastRow + 1;
    }
    return data;
}

const SelectWallet = ({navigation}) => {

    const{ open, close, provider, isConnected, } = useWalletConnectModal()
    const projectId = '3e3f9e4ec7896dafb000678ff1af2442'
    const providerMetadata = {
        name: 'NangNang',
        description: 'NangNang',
        url: 'nangnang',
        icons: ['https://your-project-logo.com/'],
        redirect: {
            native: 'YOUR_APP_SCHEME://',
            universal: 'YOUR_APP_UNIVERSAL_LINK.com'
        }
    }
    
    const ConnectData = () => {
        const expiry = provider?.session?.expiry
        console.log("expiry = ", expiry);
        const uri = provider?.uri
        console.log("uri = ", uri);
        const namespaces = provider?.namespaces
        console.log("namespaces = ", namespaces);
        const peer = provider?.session?.peer
        console.log("peer = ", peer);
        const pairingTopic = provider?.session?.pairingTopic
        console.log("pairingTopic = ", pairingTopic);
        const topic = provider?.session?.topic
        console.log("topic = ", topic);
        const url = provider?.session?.peer.metadata.url
        console.log("url = ", url);
        const name = provider?.session?.peer.metadata.name
        console.log("name = ", name);
      }
      
    const killSession =  () => {
        provider?.disconnect();
        if(isConnected){
          console.log("아직 세션 살아있음");
        }
    }
    const [payinfo] = usePayinfo();  
    const [state, dispatch] =useContext(AuthContext);
    const [modalIsVisible, setModalIsVisible] = useState(false); 
    const [selectedItem, setSelectedItem] = useState({});
    const [walletlist, setWalletList] = useState([]);
    const [errorNum, setErrorNum] = useState(0);
    const [walletAddress, setWalletAddress] = useState("");
    useEffect(()=>{
        setWalletList(wallets);
        return ()=>{

        }
    },[])
    useEffect(()=>{
        if(errorNum === 5001){
            Alert.alert("지갑선택", "결제에 사용할 지갑주소를 결정해주세요",[
                {
                    text:"확인",
                    onPress:()=>null,
                    style:"cancel"
                }
            ])
            setErrorNum(0);
        }else if (errorNum === 5000 ){
            Alert.alert("지갑선택", "사용자가 결제를 취소하였습니다.",[
                {
                    text:"확인",
                    onPress:()=>null,
                    style:"cancel"
                }
            ])
            setErrorNum(0);
        }
    },[errorNum])
    const CW = async ()=>{
        console.log("CW 함수 실행")
        if(payinfo.selectedWalletID === "" && payinfo.mywalletaddress === ""){
            Alert.alert("지갑선택", "결제에 사용할 지갑주소를 결정해주세요",[
                {
                    text:"확인",
                    onPress:()=>null,
                    style:"cancel"
                }
            ])
        }else{
            try{
                const res = await open()
                console.log(res)
            }catch(e){

            }
            console.log("open 함수 실행완료")
        }
    }
    const sendTX = async()=>{
        if (payinfo.selectedWalletID === "" && payinfo.mywalletaddress === ""){
            Alert.alert("지갑선택", "결제에 사용할 지갑주소를 결정해주세요",[
                {
                    text:"확인",
                    onPress:()=>null,
                    style:"cancel"
                }
            ])
        }else{
            try{
                console.log("결제상태 확인 - 들어왔나?")
                const res = await provider?.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        value: 1000,
                        from: payinfo.mywalletaddress,
                        to: payinfo.walletaddress,
                    }]
                })
                console.log("sendTX 해쉬값" ,res)
                try{
                    const transactionstatus = await axios({
                        method:"GET",
                        url:`https://api-goerli.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${res}&apikey=${goerliapi}`,
                    })
                    console.log(JSON.stringify(transactionstatus.data, null, 2))
                    const payresult = transactionstatus.data.status
                    if(payresult == 1 || payresult == "1"){
                        try{
                            const res = await axios({
                                method:"POST",
                                url:"https://asia-northeast3-nangnang-b59c0.cloudfunctions.net/api/paymentprocess/storepaymentdata",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                data:{
                                    "priceAddressInfo_object" : {
                                        "payment_receipt_idx" : payinfo.receiptid,
                                        "seller_id" : payinfo.sellerid,
                                        "consumer_id" : state.uid,
                                        "sender_wallet_address" : payinfo.mywalletaddress,
                                        "receiver_wallet_address" : payinfo.walletaddress,
                                        "total_won_price" : payinfo.price,
                                        "total_coin_price" : payinfo.exchangedvalue
                                        },
                                        "products": [
                                        {
                                            "product_name": payinfo.product_name,
                                            "product_won_price_per": payinfo.price,
                                            "quantity": 1
                                        },
                                        ],
                                        "networkInfo_obejct" : {
                                            "payment_receipt_idx" : payinfo.receiptid,
                                            "main_blockchain_name" : "Ethereum",
                                            "detailed_network_name" : "Ethereum Mainnet",
                                            "detailed_network_real_id_num" : "1",
                                            "payment_wallet_name" : payinfo.selectedWallet
                                        }
                                }
                            })
                            console.log("결제 데이터 저장", JSON.stringify(res, null, 2))
                            navigation.navigate("PayResult")
                            console.log("결제 데이터 저장 완료")
                        }catch(e){
                            console.log("결제 데이터 저장 오류")
                            console.log("결제 에러 ",e)
                        }   
                    }
                    console.log("결제 해쉬값 확인 완료")
                }catch(e){
                    console.log("해쉬값 확인 에러")
                }
            }catch(e){
                console.log("Error - ",e)
                setErrorNum(e.code);
            }
            console.log(JSON.stringify(payinfo, null, 2))
            console.log("sendTX 완료")
        }
    }

    const CloseModalHandler = () => {
        setModalIsVisible(false);
    }

    const handleListItemPress = (item) => {
        const wallet_address = state.wallet.find(e=> e.wallet_num === item.id_num).walletaddress
        setSelectedItem(item)
        setModalIsVisible(true)
        setWalletAddress(wallet_address)
    }   
    const params = {
        namespaces: {
            eip155: {
              methods: [
                'eth_sendTransaction',
                'eth_signTransaction',
                'eth_sign',
                'personal_sign',
                'eth_signTypedData',
                'wallet_addEthereumChain',
                'wallet_switchEthereumChain',
              ],
              chains: ['eip155:1'],
              events: ['chainChanged', 'accountsChanged'],
              rpcMap: {},
            },
          },
        optionalNamespaces: {
        eip155: {
            methods: [
            'eth_sendTransaction',
            'eth_signTransaction',
            'eth_sign',
            'personal_sign',
            'eth_signTypedData',
            'wallet_addEthereumChain',
            'wallet_switchEthereumChain',
            ],
            chains: ['eip155:1', 'eip155:137', 'eip155:5'],
            events: ['chainChanged', 'accountsChanged'],
            rpcMap: {},
        },
        },
    }
    const chainChangeTry = async () => {
        let result = await provider.connect({
            namespaces: {
                eip155: {
                  methods: [
                    'eth_sendTransaction',
                    'eth_signTransaction',
                    'eth_sign',
                    'personal_sign',
                    'eth_signTypedData',
                    'wallet_addEthereumChain',
                    'wallet_switchEthereumChain',
                  ],
                  chains: ['eip155:1'],
                  events: ['chainChanged', 'accountsChanged'],
                  rpcMap: {},
                },
              },
            optionalNamespaces: {
            eip155: {
                methods: [
                'eth_sendTransaction',
                'eth_signTransaction',
                'eth_sign',
                'personal_sign',
                'eth_signTypedData',
                'wallet_addEthereumChain',
                'wallet_switchEthereumChain',
                ],
                chains: ['eip155:1', 'eip155:137', 'eip155:5'],
                events: ['chainChanged', 'accountsChanged'],
                rpcMap: {},
            },
            },
        })
        console.log("chainChangeTry result = ", result)

    }

    const switchChain1 = async () => {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: '0x38',
              },
            ],
          });
        } catch (error) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x38',
                chainName: 'Bsc',
                nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                rpcUrls: ['https://bsc.publicnode.com'],
              },
            ],
          });
        }
      };
      const switchChain2 = async () => {
        try {
            let chainId =  137;
            await provider?.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId.toString(16)}` }],
                
            });
        } catch (error) {
            console.log(error);
        }
      }
    
    const session_update = async (i_topic, i_params) => {
        // Subscribe to session update
        provider.on("session_update", ({ i_topic, i_params }) => {
            console.log("session_update", i_topic, i_params);
        });
  
    }

    return (
        <View style={styles.MyWalletsView}>
            <View style={styles.header}>
                <Link to={{screen:'Main'}} style={styles.link}>메인으로가기</Link>
                <Text style={{color:'red'}}>사용자 : {state.name}</Text>
                <HeaderLogo />
            </View>
            <View style={styles.title}>
                <ScreenTitle title="지갑 선택" />
            </View>
            <View style={styles.submitbutton}>
                {isConnected ?
                    <View>
                        <Text style={{color:Colors.indigo400, fontWeight:'bold'}}>
                            연결된 지갑 : {provider?.session?.peer.metadata.name}
                        </Text>
                        <WalletButton 
                            onPress={()=>sendTX()} style={{backgroundColor: Colors.orange500}}>
                            <Text >{"결제 하기"}</Text>
                        </WalletButton>
                        <WalletButton 
                            onPress={()=>chainChangeTry()} style={{backgroundColor: Colors.orange500}}>
                            <Text >{"체인 추가전 준비"}</Text>
                        </WalletButton>
                        <WalletButton 
                            onPress={()=>switchChain1()} style={{backgroundColor: Colors.orange500}}>
                            <Text >{"체인 변경1!"}</Text>
                        </WalletButton>
                        <WalletButton 
                            onPress={()=>switchChain2()} style={{backgroundColor: Colors.orange500}}>
                            <Text >{"체인 변경2!"}</Text>
                        </WalletButton>
                        <WalletButton 
                            onPress={()=>session_update(provider.session.topic, params )} style={{backgroundColor: Colors.orange500}}>
                            <Text >{"session_update"}</Text>
                        </WalletButton>

                        <WalletButton onPress={()=>ConnectData()} style={{marginTop:16}}>
                            <Text >{'지갑 연결 데이터 확인'}</Text>
                        </WalletButton>
                        <WalletButton onPress={()=>killSession()} style={{marginTop:16}}>
                            <Text >{'지갑 연결 세션 종료'}</Text>
                        </WalletButton>
                    </View>
                    : <SubmitButton 
                        onPress={()=>CW()} >{'지갑 연결하기'}</SubmitButton>
                }
            </View>
            <View style={{alignSelf:'flex-end',paddingHorizontal:16}}>
                    <Pressable style={{        
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: Colors.orange500,
                        padding:5,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        }}onPress={() => navigation.navigate('Payinfo')}><Text style={{fontWeight:'bold', color: Colors.orange400}}>결제 정보 확인</Text></Pressable>
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
                                    style={[styles.button,{backgroundColor: item.selected ? Colors.orange400 : null}]}
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
            <WalletConnectModal projectId={projectId} providerMetadata={providerMetadata} />

            <WalletInputModal
                    selecteditem={selectedItem}
                    visible={modalIsVisible}
                    oncancel={CloseModalHandler}
                    walletlist={walletlist}
                    setWalletList={setWalletList}
                    walletAddress={walletAddress}/>
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
    submitbutton:{
        width:'40%',alignSelf:'center',
        marginBottom:16,
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