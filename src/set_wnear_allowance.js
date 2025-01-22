import { Web3, HttpProvider } from 'web3';
import 'dotenv/config';

const mainnet = 'https://mainnet.aurora.dev';
const testnet = 'https://testnet.aurora.dev';

const provider = new HttpProvider(testnet);
const web3 = new Web3(provider);

const token = '0x4861825E75ab14553E5aF711EbbE6873d369d146';
const wallet = '0xDdE068fd58FD10ed15D0f68FC7cD214237A1E9af';
const xcccontract = '0xAD4d50e8033CCc4e0185F2a1f82e56B63a385D1a';

const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

const erc20ABI = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_spender",
            "type": "address"
        }, {
            "name": "_value",
            "type": "uint256"
        }],
        "name": "approve",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "_owner",
            "type": "address"
        }, {
            "name": "_spender",
            "type": "address"
        }],
        "name": "allowance",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
    "constant": false,
    "inputs": [
        {
            "name": "_to",
            "type": "address"
        },
        {
            "name": "_value",
            "type": "uint256"
        }
    ],
    "name": "transfer",
    "outputs": [
        {
            "name": "",
            "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
];

const contract = new web3.eth.Contract(erc20ABI, token);

const getBalance = async () => {
    return await contract.methods.balanceOf(wallet).call();
}

getBalance().then(x => console.log(web3.utils.fromWei(Number(x), 'ether')/1000000));

const allowance = async () => {
    return await contract.methods.allowance(wallet, xcccontract).call();
}

const check_allowance = () => allowance().then(x => console.log(web3.utils.fromWei(Number(x), 'ether')/1000000));

check_allowance();

async function approve() {
    try {
        const data = await contract.methods.approve(xcccontract, web3.utils.toWei("2000000", "ether")).encodeABI();
        const nonce = await web3.eth.getTransactionCount(account.address, 'pending');
        const signed = account.signTransaction({
            to: token,
            value: 0,
            gasLimit: '0x186A0',
            gasPrice: '0x104C533C00',
            data: data,
            chainId: 1313161555,
            nonce: nonce });
        signed.then(s => {
            let tx = web3.eth.sendSignedTransaction(s.rawTransaction);
            console.log('Waiting for tx to confirm...');
        });
    } catch (error) {
        console.error(error);
    }
}

approve();
await new Promise(r => setTimeout(r, 2000)).then(i => check_allowance());