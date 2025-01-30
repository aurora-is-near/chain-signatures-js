import {Bitcoin} from './chainsigs/bitcoin.js'

const BTC = new Bitcoin('mainnet');

/*const test_account1 = {
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
}*/

const safe_account = {
    address: 'bc1qunau3q49dqewseky6nl9dqmq5fjsjfxmlkht8k',
    publicKey: '02ac2ac40a97879c728d0f9830996793b130aa5be0cf41f796ac7afcf739a72649',
    nearAccount: 'f7607cd922804daa9d54d21349dd6f9467098dde.aurora',
    path: '0x70ebe9fbc4e9920b07a1f043b2bede8fc2e09504'
};

const eoa_account = {
    address: 'bc1ql73afxh5ugmjhpscuz8prhyyhshlgamms68egj',
    publicKey: '028690423092086d9e857af131e462091edbaded211a662e4b70869bc82a8f6066',
    nearAccount: 'f7607cd922804daa9d54d21349dd6f9467098dde.aurora',
    path: '0xdde068fd58fd10ed15d0f68fc7cd214237a1e9af'
};

function log_data(label, data){
    console.log('\n');
    console.log(label);
    console.log(data);
}

let tx = null;
const sats = 10000;
const path = safe_account.path;
const pkey = safe_account.publicKey;
const toAddress = '14secnpokXzrjRa3fEwcJ1RQKusCp3kTUA';

BTC.createTransaction({
    from: safe_account.address,
    to: toAddress,
    amount: sats
}).then(data => {
        log_data("Your tx is:", JSON.stringify(data, null, 4));
        tx = data;
        return data;
}).then(d => {
    return BTC.requestSignature({
        path: path,
        psbt: d.psbt,
        utxos: d.utxos,
        publicKey: pkey})
}).then(signedTx => {
    return BTC.broadcastTX(signedTx)
}).then(hash => {
    let url = `https://blockstream.info/${BTC.networkId === 'testnet' ? 'testnet/' : '/'}tx/`;
    console.log('\n Now, you can find your transaction here: ' + url + hash);
});
