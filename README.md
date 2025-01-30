# Chain Signatures JS

Some Node JS scripts to help you with NEAR Chain Signatures:

- Allows to derive BTC addresses on Mainnet and Testnet
- Create transactions for BTC transfers

This repo is based on the [Near Multichain Examples](https://github.com/near-examples/near-multichain/tree/main). But we have:

- removed the UI part
- left only Bitcoin part of the code (derivation, relaying, etc.)
- instead of sending transactions to the MPC, we wait here async for the `affine_point` and `scalar` to sign the transaction, so you need to get them by yourself.

This was done to simplify everything for the Safe BTC Demo. Or speaking more generally, to allow using Bitcoin Chain Signatures with contracts on Aurora, which is done with the [Chain Signatures Signer](https://github.com/aurora-is-near/chain-signatures-signer/tree/main) contract via XCC.

## Init repo

Use `pnpm` to install the Node modules:
```bash
brew install pnpm
pnpm i
```

## Deriving your addresses on Bitcoin

Just go to `src/derive_account.js` and enter if you want to use mainnet or testnet, your NEAR address, and derivation path:

```js
//Example
const BTC = new Bitcoin('mainnet'); // <- mainnet

const account = 'f7607cd922804daa9d54d21349dd6f9467098dde.aurora'; // <- XCC subaccount address, but you can use yours .near account instead

let path = '0x70ebe9fbc4e9920b07a1f043b2bede8fc2e09504'; // <-- derivation path, could be any seed, like 'bitcoin-1', 'bitcoin-2', etc. But in Safe BTC Demo we need it to correspond to the address on Aurora.
```

Now you can execute it: 
```bash
node src/derive_account.js
```

You will get your account primary data, balance and UTXOs:

```bash
Your BTC account data is: 
{
  address: 'bc1qunau3q49dqewseky6nl9dqmq5fjsjfxmlkht8k',
  publicKey: '02ac2ac40a97879c728d0f9830996793b130aa5be0cf41f796ac7afcf739a72649',
  nearAccount: 'f7607cd922804daa9d54d21349dd6f9467098dde.aurora',
  path: '0x70ebe9fbc4e9920b07a1f043b2bede8fc2e09504'
}

Balance is: 469 BTC


UTXOS are: 
[
  {
    txid: '4fb6db4b62a4f76e92e93dbc70790a7aed81bfd9e8ec874f7cec79740ac0f53d',
    vout: 1,
    status: {
      confirmed: true,
      block_height: 880529,
      block_hash: '00000000000000000000e22fd1a67de788f19188bbf531b7871df901a898e3f2',
      block_time: 1737656574
    },
    value: 469
  }
]
```

## Sending transactions to Bitcoin

Now, you can take the derived account data and use it inside `src/send_tx.js` script. 

It was designed to execute a BTC transfer between two accounts.

Enter your data into some struct like:
```js
const safe_account = {
    address: 'bc1qunau3q49dqewseky6nl9dqmq5fjsjfxmlkht8k',
    publicKey: '02ac2ac40a97879c728d0f9830996793b130aa5be0cf41f796ac7afcf739a72649',
    nearAccount: 'f7607cd922804daa9d54d21349dd6f9467098dde.aurora',
    path: '0x70ebe9fbc4e9920b07a1f043b2bede8fc2e09504'
};
```

You should also prepare the data for BTC transfer in these variables (around line 40):

```js
const sats = 10000; // <-- amount of Satoshis to transfer
const path = safe_account.path; // <-- derivation path of source account
const pkey = safe_account.publicKey; // <-- pubkey of source account
const toAddress = '14secnpokXzrjRa3fEwcJ1RQKusCp3kTUA'; // <-- destination address
```

Now, you're ready to send the transaction:
```bash
node src/send_tx.js 
```

You will see the unsigned transaction in the output:

```bash
Your tx is:
{
    "utxos": [
        {
            "txid": "757a6ba03528c98f70ef12094ad0b8d0f365c733b09f616f63f8acf40f783b8d",
            ...
            "value": 11147
        }
    ],
    "psbt": {
        "data": {
            "inputs": [
                {
                    "unknownKeyVals": [],
                    "witnessUtxo": {
                        "script": {
                            "type": "Buffer",
                            "data": [...]
                        },
                        "value": 11147
                    }
                }
            ],
            "outputs": [...],
            "globalMap": {...}
        }
    }
```

And also the payload to sign in your MPC request:

```bash
{
  request: {
    payload: 'a775c4f16894cef071b1fcc43fe73f600324f170ea3a4a136144e2ea370cabdd',
    path: '0x70ebe9fbc4e9920b07a1f043b2bede8fc2e09504',
    key_version: 0
  }
}
```

The console will hang waiting for you to enter the signed data now:
```bash
Please enter `affine_point`:
```

That signed data consists of `affine_point` and `scalar`. Which you can get from calling `sign` method on the MPC contract.

 We are doing this via [Chain Signatures Signer](https://github.com/aurora-is-near/chain-signatures-signer/tree/main) and XCC.

Take a look at the [example of such transaction](https://explorer.mainnet.aurora.dev/tx/0x7231f39351187d2e694b82a0f3b57a70eabaddf5534152d4d6b3ee77ebd271ec?tab=logs) on Aurora with the `SignedEvent` in the logs.

After entering that data, you will get:

```bash
Please enter `affine_point`:
02429458C76339637F25C2E5113EACA4042C0A1F3D161E9871F52DDABF738789FE

Please enter `scalar`:
49F469BC4897AD28B5C83C483599FA20C84357A8AA6B86D82C7828B8B05E8233

Input 0 signed successfully

Signed TX: 
020000000001018d3b780ff4acf8636f619fb033c765f3d0b8d04a0912ef708fc92835a06b7a750000000000ffffffff0210270000000000001976a9142a7c939b6172d414176c41db2e4377241bf00c7b88acd501000000000000160014e4fbc882a56832e866c4d4fe568360a2650924db024730440220429458c76339637f25c2e5113eaca4042c0a1f3d161e9871f52ddabf738789fe022049f469bc4897ad28b5c83c483599fa20c84357a8aa6b86d82c7828b8b05e8233012102ac2ac40a97879c728d0f9830996793b130aa5be0cf41f796ac7afcf739a7264900000000

Now, you can find your transaction here: https://blockstream.info/tx/4fb6db4b62a4f76e92e93dbc70790a7aed81bfd9e8ec874f7cec79740ac0f53d
```

So you can go to the Blockstream explorer and see if it is working. 

If you encounter any errors, you can take `Signed TX` output above and just send it via `curl` to the RPC to see what the problem is:

```bash
curl -H 'Content-Type: application/json' \
     -d '02000000000101cf2ee8efdcda760eb9227e870b8dda8c718b0ffd0ea79755c545cdac49ab21cd0000000000ffffffff02e8030000000000001600141975f81fd810f1b2c10117bd5cf1f500e3ad22b4e02d000000000000160014e693db25ca09fee3235ff2241ec3cf4a032f771a024730440220760e7178ba458797e84807d288d9d8541b97153d8a4d12c754af83323247f4ca02207452aea35950877e51d858f0973f39772a2a301c1473287a94ad6e13223f5b1f012102b013faa3de8f5eb79fae772c854731153eab3dade846d2e5541477487769dd3a00000000' \
     -X POST \
     https://blockstream.info/api/tx
```
I was getting:
```bash
sendrawtransaction RPC error -26: mandatory-script-verify-flag-failed (Signature must be zero for failed CHECK(MULTI)SIG operation)%
```

Which just meant that I had a bad signature. In my case the problem was having a wrong MPC pubkey inside the config.

## Outro

That is it. Feel free to contact me in Telegram if you will need more support or have any questions – @dhilbert or on Aurora Discord (@slava).