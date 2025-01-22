import {Bitcoin} from './chainsigs/bitcoin.js'

const BTC = new Bitcoin('testnet');
const address = '7e4f22f1ee20e01719ff1d986d116b04abb2ee3f.aurora';
const path = 'bitcoin-1';

const test_account1 = {
    address: 'tb1qz0wauyj2wpa4v0q6ymz0saef9t8cr682fml6qe',
    publicKey: '02661558c334611339802852909e4a04c867b9e9dc12d21daf53081343eccee9a0',
    nearAccount: '7e4f22f1ee20e01719ff1d986d116b04abb2ee3f.aurora',
    path: 'bitcoin-1'
}

const test_account2 = {
    address: 'tb1qm9cma09q70qq0caa40rp8hnp5yedu4gd4u5dzv',
    publicKey: '03495950f4a019ac80e92e6a526dc0ee57617f9b1c439639b6665f38c263f4307b',
    nearAccount: '7e4f22f1ee20e01719ff1d986d116b04abb2ee3f.aurora',
    path: 'bitcoin-2'
}

function log_data(label, data){
    console.log('\n');
    console.log(label);
    console.log(data);
}

let tx = null;
const sats = 1000;

BTC.createTransaction({from: test_account1.address, to: test_account2.address, amount: sats}).then(data => {
    log_data("Your tx is:", JSON.stringify(data, null, 4));
    tx = data;
    return data;
}).then(d => {
    console.log(test_account1.publicKey);
    return BTC.requestSignature({
        path: test_account1.path,
        psbt: d.psbt,
        utxos: d.utxos,
        publicKey: test_account1.publicKey})
}).then(signedTx => {
    return BTC.broadcastTX(signedTx)
}).then(hash => {
    //for mainnet
    //let url = 'https://blockstream.info/tx/';
    let url = 'https://blockstream.info/testnet/tx/';
    console.log('\n Now, you can find your transaction here: ' + url + hash);
});
