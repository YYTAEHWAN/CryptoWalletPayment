실행 방법

1. 먼저 다운 받습니다.

2. 상위 폴더 app 위치에서 yarn 이나 npm으로 node_moudles를 설치해줍니다.

3. 그리고 example/app.config.json 파일로 가서 extra: 에 projectId 에 walletconnect project id를 넣어줍니다.
저것만 있으면 되는 줄 알았는데 아니네요 example 폴더 안에 .env 파일을 만들어주고 EXPO_PUBLIC_PROJECT_ID="YOUR_PROJECT_ID" 이렇게 넣어주면 됩니다.

4. 이제 실행시켜줍니다.
app 폴더에서 실행하는 커맨드는 다음과 같습니다.
- `yarn example ios` - Run the example project in an iOS simulator.
- `yarn example android` - Run the example project in an Android simulator.

핸드폰으로만 expo를 연결하기 방법은
 app/example 폴더로 이동한 뒤
- `npx expo start` - Run the example project 




# WalletConnectModal SDK for React Native

Your on-ramp to web3 multichain. WalletConnect Modal is a versatile library that makes it super easy to connect users with your Dapp and start interacting with the blockchain.

### 📚 [Documentation](https://docs.walletconnect.com/2.0/reactnative/walletconnectmodal/about)

### 🔎 [Examples](https://github.com/WalletConnect/react-native-examples/tree/main/dapps/v2Explorer)

## Development

Please follow [developer docs](./.github/docs/development.md) to set up WalletConnect Modal locally.
