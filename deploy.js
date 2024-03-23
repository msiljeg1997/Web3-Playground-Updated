require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
//updated web3 and hdwallet-provider imports added for convenience
const { abi, evm } = require('./compile');
// deploy code will go here

// tu mu dajem providera koj ce se koristiti za deploy a to je hdwalletprovider
// i dajem mu mnemonic i infura url koji sam stavio u .env file ofc makar je test network
const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.INFURA_URL
 );

 //tu kreiram web3 instancu i feedam ga sa tim providerom
const web3 = new Web3(provider);

//deploy funkcija koja ce deployat contract
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
   
    console.log('Attempting to deploy from account', accounts[0]);
   
    const result = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
      .send({ gas: '1000000', from: accounts[0] });
   
    console.log('Contract deployed to', result.options.address);
    //preventiramo da deployment 'hanga' u terminalugit add README.md
    provider.engine.stop();
  };
   
  deploy();