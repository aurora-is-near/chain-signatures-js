import {Bitcoin} from './chainsigs/bitcoin.js'

const BTC = new Bitcoin('mainnet');
const account = 'f7607cd922804daa9d54d21349dd6f9467098dde.aurora';
let path = '0x70ebe9fbc4e9920b07a1f043b2bede8fc2e09504'; // this is our Safe
//path = '0xDdE068fd58FD10ed15D0f68FC7cD214237A1E9af'.toLowerCase(); // this is my account

function log_data(label, data){
    console.log('\n');
    console.log(label);
    console.log(data);
}

BTC.deriveAddress(account, path).then(data => {
    data.nearAccount = account;
    data.path = path;
    log_data('Your BTC account data is: ', data);
    return data;
}).then(data => {
    return BTC.getUtxos(data);
}).then(utxos => {
    log_data('UTXOS are: ', utxos);
    return utxos;
});

BTC.deriveAddress(account, path).then(data => {
    return BTC.getBalance(data);
}).then(balance => {
    console.log('\nBalance is: ' + balance + ' BTC');
});