import { sanitizeHex, numberToHex } from '@walletconnect/encoding';
import ethers from 'ethers';

const sendTransaction = async ({ web3Provider, method }) => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }

  // Get the signer from the UniversalProvider
  const signer = web3Provider.getSigner();
  const [address] = await web3Provider.listAccounts();

  if (!address) {
    throw new Error('No address found');
  }

  const amount = sanitizeHex(numberToHex(0));

  const transaction = {
    from: address,
    to: address,
    value: amount,
    data: '0x',
  };

  // Send the transaction using the signer
  const txResponse = await signer.sendTransaction(transaction);

  const transactionHash = txResponse.hash;
  console.log('transactionHash is ' + transactionHash);

  // Wait for the transaction to be mined (optional)
  const receipt = await txResponse.wait();
  console.log('Transaction was mined in block:', receipt.blockNumber);

  return {
    method,
    address,
    valid: true,
    result: transactionHash,
  };
};


export function BlockchainActions() {
    const { provider } = useWalletConnectModal();
    let result = provider.session;
    console.log('result session is ' + result + 'in BlockchainActions.js');
  
    const web3Provider = useMemo(
      () => (provider ? new ethers.providers.Web3Provider(provider) : undefined),
      [provider]
    );
  
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
  
    const sendTransactionCallback = async () => {
      if (!web3Provider) return;
  
      setLoading(true);
  
      try {
        let method = "sendTransaction";
        const result = await sendTransaction({ web3Provider , method});
          console.log('result is ' + result);
        // 여기서 result를 활용하여 사용자에게 표시할 처리 로직을 작성할 수 있음
      } catch (error) {
        console.error('sendTransaction failed:', error);
  
        // 에러 처리 로직을 작성할 수 있음
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <>
        <FlatList
          ListHeaderComponent={
            <TouchableOpacity onPress={onButtonPress}>
              <Text>{isConnected ? 'Disconnect' : 'Connect Wallet'}</Text>
            </TouchableOpacity>
          }
          renderItem={() => (
            <TouchableOpacity onPress={sendTransactionCallback}>
              <Text>Send Transaction</Text>
            </TouchableOpacity>
          )}
        />
      </>
    );
  }