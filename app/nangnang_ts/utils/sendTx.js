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

module.exports = { sendTransaction };