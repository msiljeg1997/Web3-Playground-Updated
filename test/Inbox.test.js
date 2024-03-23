const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());
 
const { abi, evm } = require('../compile');
 
let accounts;
let inbox;
 
//beforeEach se koristi za inicijalizaciju varijabli prije svakog testa
//u ovom slucaju inicijaliziramo varijable accounts i inbox
//inbox je contract koji deployamo sa web3.eth.Contract i koristimo ga za testiranje
//stavljamo argument 'Hi there!' u contract za testiranje
beforeEach(async () => {
// trazim listu svih accounta
  accounts = await web3.eth.getAccounts();
//abi je interface a evm je bytecode koji oboje koristimo za deploy contracta
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: ['Hi there!'],
    })
//vidim da imam jedan account i deployam contract sa tim accountom pomocu send metode
    .send({ from: accounts[0], gas: '1000000' });
});
 
  //describe u mochi se koristi za grupiranje testova
  //it za testiranje pojedinacnih funkcija
  //assert za provjeru da li je neki uvjet ispunjen
  //u ovom slucaju da li je contract deployan, pa koristimo assert.ok kao provjeru dali postoji adresa (true/false)
  describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });
  //u ovom slucaju da li je message jednak 'Hi there!' iz beforeEacha pa koristimo assert.equal 
  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hi there!');
  });
  //ovdje mjenjamo message i provjeravamo da li je promjena uspjesna sa assert.equal
  it('can change the message', async () => {
    await inbox.methods.setMessage('bye').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
  });
});