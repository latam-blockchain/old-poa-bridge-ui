const ethers = require("ethers");

const PRIV_KEY                  = 'a931acf1e180e569be8ed439b05fd78fedf276502c6f8d475a6687b7cc30e965' // my test user priv_key

const ERC20_ABI                 = require('./contracts/build/contracts/ERC20').abi
const HOME_ERC_TO_NATIVE_ABI    = require('./contracts/build/contracts/HomeBridgeErcToNative').abi

const ERC20_CONTRACT_ADDRESS    = "0xD92E713d051C37EbB2561803a3b5FBAbc4962431";                      // usdt on rinkeby
const HOME_BRIDGE_PROXY_ADDRESS = "0x09b75316259ca5a090697Ef581a4245aabdEB415";

async function main() {


// for metamask :
// https://docs.ethers.io/v5/getting-started/#getting-started--connecting
// https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents
// metamask-ethers example
// const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
// await provider.send("eth_requestAccounts", []);
// const signer = provider.getSigner();
// console.log("Account:", await signer.getAddress());

// Create providers for both networks https://docs.ethers.io/v5/api/providers/jsonrpc-provider/
const homeProvider     = new ethers.providers.JsonRpcProvider('https://rpc.latam-blockchain.com');
const foreignProvider  = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/923386bd6e9f439fa435d0929f36786d');

// Make a wallet instance using private key and provider
const homeSigner    = new ethers.Wallet(PRIV_KEY, homeProvider);
const foreignSigner = new ethers.Wallet(PRIV_KEY, foreignProvider);


console.log(' ');
console.log('               HOME CHAIN GENERAL VARIABLES                      ')
let homeChainID          = await homeSigner.getChainId()
let homeBlockNumber      = await homeProvider.getBlockNumber()
//TODO check why our chain show GasPrice 0, cause not enouth txs to calculate?
let homeGasPrice         = await homeSigner.getGasPrice()
let homeTransactionCount = await homeSigner.getTransactionCount()
let homeBalance          = await homeSigner.getBalance()
console.log("ChainID                    :",homeChainID);
console.log("Block heigth               :",homeBlockNumber);
console.log("GasPrice                   :",homeGasPrice);
console.log("nonce                      :",homeTransactionCount);
console.log("User Coin balance          :",ethers.utils.formatEther(homeBalance),"USD");
console.log(' ');


console.log('               FOREIGN CHAIN GENERAL VARIABLES                      ')
let foreignChainID          = await foreignSigner.getChainId()
let foreignBlockNumber      = await foreignProvider.getBlockNumber()
let foreignGasPrice         = await foreignSigner.getGasPrice()
let foreignTransactionCount = await foreignSigner.getTransactionCount()
let foreignBalance          = await foreignSigner.getBalance()
console.log("ChainID                    :",foreignChainID);
console.log("Block heigth               :",foreignBlockNumber);
console.log("GasPrice                   :",ethers.utils.formatUnits(foreignGasPrice,'gwei'));
console.log("nonce                      :",foreignTransactionCount);
console.log("User Coin balance          :",ethers.utils.formatEther(foreignBalance),"ETH");
console.log(' ');

console.log('               FOREIGN ERC20 TOKEN DATA (rinkeby)                        ')
// Read-Only cause is connected to a Provider and not a signer;
const erc20contract = new ethers.Contract(ERC20_CONTRACT_ADDRESS, ERC20_ABI, foreignProvider);
let erc20tokenName = await erc20contract.name()
// Get erc20 token decimal precision
let erc20decimals = await erc20contract.decimals()
// Get erc20 token symbol
let erc20symbol   = await erc20contract.symbol()
// Get erc20 token balance
let erc20balance  = await erc20contract.balanceOf(foreignSigner.getAddress())
console.log("User",erc20tokenName," balance:",ethers.utils.formatUnits(erc20balance,erc20decimals),erc20symbol)
console.log(' ');


console.log('                  HOME BRIDGE DATA                                            ')
// Read-Only cause is connected to a Provider and not a signer;
const homeBridgeContract = new ethers.Contract(HOME_BRIDGE_PROXY_ADDRESS, HOME_ERC_TO_NATIVE_ABI, homeProvider);
let totalBurnCoins = await homeBridgeContract.totalBurntCoins()
console.log('totalBurnCoins             :',ethers.utils.formatEther(totalBurnCoins))
let getCurrentDay    = await homeBridgeContract.getCurrentDay()
let totalSpentPerDay = await homeBridgeContract.totalSpentPerDay(getCurrentDay)
console.log('totalSpentPerDay           :',ethers.utils.formatEther(totalSpentPerDay))
let requiredBlockConfirmations    = await homeBridgeContract.requiredBlockConfirmations()
console.log('requiredBlockConfirmations :',requiredBlockConfirmations.toString())
let getBridgeMode    = await homeBridgeContract.getBridgeMode()
console.log('getBridgeMode              :',getBridgeMode)
let executionDailyLimit    = await homeBridgeContract.executionDailyLimit()
console.log('executionDailyLimit        :',ethers.utils.formatEther(executionDailyLimit))
let totalExecutedPerDay    = await homeBridgeContract.totalExecutedPerDay(getCurrentDay)
console.log('totalExecutedPerDay        :',ethers.utils.formatEther(totalExecutedPerDay))
let executionMaxPerTx    = await homeBridgeContract.executionMaxPerTx()
console.log('executionMaxPerTx          :',ethers.utils.formatEther(executionMaxPerTx))
let requiredSignatures    = await homeBridgeContract.requiredSignatures()
console.log('requiredSignatures         :',requiredSignatures.toString())
let maxAvailablePerTx    = await homeBridgeContract.maxAvailablePerTx()
console.log('maxAvailablePerTx          :',ethers.utils.formatEther(maxAvailablePerTx))
let outOfLimitAmount    = await homeBridgeContract.outOfLimitAmount()
console.log('outOfLimitAmount           :',outOfLimitAmount.toString())
let maxPerTx    = await homeBridgeContract.maxPerTx()
console.log('maxPerTx                   :',ethers.utils.formatEther(maxPerTx))
let minPerTx    = await homeBridgeContract.minPerTx()
console.log('minPerTx                   :',ethers.utils.formatEther(minPerTx))
let gasPrice    = await homeBridgeContract.gasPrice()
console.log('gasPrice                   :',ethers.utils.formatUnits(gasPrice,'gwei'))

//let eventFilter = homeBridgeContract.filters.SignedForAffirmation()
let eventFilter = [
                //homeBridgeContract.filters.submitSignature,
                //homeBridgeContract.filters.executeAffirmation,
                homeBridgeContract.filters.UserRequestForSignature,
];
let  contractqueryFilter = await homeBridgeContract.queryFilter(eventFilter,-5000,'latest')
console.log(contractqueryFilter)
//console.log('                  FOREIGN BRIDGE DATA                                            ')
// Read-Only cause is connected to a Provider and not a signer;
//const homeBridgeContract = new ethers.Contract(HOME_BRIDGE_PROXY_ADDRESS, HOME_ERC_TO_NATIVE_ABI, homeProvider);

}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });






