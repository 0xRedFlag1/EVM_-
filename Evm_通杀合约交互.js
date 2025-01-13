const { Web3 } = require('web3');
const dotenv = require('dotenv');
const { HttpsProxyAgent } = require('https-proxy-agent');

// 加载 .env 文件中的环境变量
dotenv.config();

// 从环境变量中获取配置
const proxyAddress = process.env.PROXY_ADDRESS;
const proxyPort = process.env.PROXY_PORT;
const address = process.env.ADDRESS.startsWith('0x') ? process.env.ADDRESS.slice(2) : process.env.ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const rounds = parseInt(process.env.ROUNDS, 10);

// 创建一个代理代理
const proxyAgent = new HttpsProxyAgent(`http://${proxyAddress}:${proxyPort}`);

// 创建一个新的 Web3 实例，并配置代理
const web3 = new Web3('https://rpc.testnetv2.tabichain.com/', { timeout: 0, agent: proxyAgent });
// RPC URL
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

function getChinaTimestamp() {
  const date = new Date();
  date.setTime(date.getTime() + 0 * 60 * 60 * 1000); 
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `[${hours}:${minutes}:${seconds}]`;
}

async function sendTransaction(hexData, nonce, gasPrice) {
  try {
    const tx = {
      from: account.address,
      to: '0xcDc10593a66185AAa206665C5083ac51Ad935F91',
      value: '0',
      gas: 100000,
      gasPrice: BigInt(gasPrice),
      nonce: BigInt(nonce),
      data: hexData
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`${getChinaTimestamp()} - 交易 hash: ${receipt.transactionHash}`);
  } catch (error) {
    console.error(`${getChinaTimestamp()} - 错误: ${error.message}`);
  }
}


function printAsciiArt() {
  console.log(`
`);
console.log("=======================[ 作者：红旗 / Red Flag ]=======================");
console.log("=======================[ Twitter：A900DDD ]===========================");
console.log("=======================[ QQ：384294000 ]==============================");
console.log("=======================[ 交流群：638708943 ]===========================");
}
                                                                                          


async function main() {
  printAsciiArt();

  console.log(`${getChinaTimestamp()} - 连接到 eth 网...`);
  const hexData = '0x1249c58b';
  const transactionsPerRound = 1; 

  for (let r = 0; r < rounds; r++) {
    const initialNonce = await web3.eth.getTransactionCount(account.address);
    const transactions = [];

    for (let i = 0; i < transactionsPerRound; i++) {
      const nonce = BigInt(initialNonce) + BigInt(i);
      const currentGasPrice = await web3.eth.getGasPrice();
      const increasedGasPrice = BigInt(currentGasPrice) * BigInt(100) / BigInt(100); // 增加20%
      transactions.push(sendTransaction(hexData, nonce.toString(), increasedGasPrice.toString()));
    }

    await Promise.all(transactions);
    console.log(`${getChinaTimestamp()} - 轮次 ${r + 1} 的所有交易已发送`);
  }
}

main();
