import {Bitcoin} from './chainsigs/bitcoin.js'

const BTC = new Bitcoin('testnet');
const account = '7e4f22f1ee20e01719ff1d986d116b04abb2ee3f.aurora';
const path = 'bitcoin-1';

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