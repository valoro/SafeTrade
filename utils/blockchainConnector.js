const axios = require('axios');
const BlockchainStrings = require('./blockchainStrings');
const cron = require("node-cron");

cron.schedule('* * 23 * * *', () => {
    axios({
        method: 'POST',
        url: `${BlockchainStrings.URL}/authenticate`,
        data: {
            email: BlockchainStrings.EMAIL,
            password: BlockchainStrings.PASSWORD
        }
    })
    .then(response => {
        process.env.SAFE_TRADE_TOKEN = response.data.token;
    })
    .catch(err => {
        console.log('cant update token!, ', err);
    })
    console.log('updating blockchain user token evrery 23 hours, ', process.env.SAFE_TRADE_TOKEN);
});

module.exports = {
    queryAllAssets: async asset => {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: `${BlockchainStrings.URL}/asset/${asset}/?networkName=${BlockchainStrings.NETWORKNAME}&contractName=${BlockchainStrings.CONTRACTNAME}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.SAFE_TRADE_TOKEN
                }
            })
            .then(response => {
                return resolve(response.data);
            })
            .catch(err => {
                return reject(err);
            })
        })
    },
    queryAssetById: async (asset, assetId) => {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: `${BlockchainStrings.URL}/asset/${asset}/${assetId}/?networkName=${BlockchainStrings.NETWORKNAME}&contractName=${BlockchainStrings.CONTRACTNAME}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.SAFE_TRADE_TOKEN
                }
            })
            .then(response => {
                return resolve(response.data);
            })
            .catch(err => {
                return reject(err);
            })
        })
    },
    instantiateAsset: async (asset, values) => {
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: `${BlockchainStrings.URL}/asset/instantiate/${asset}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.SAFE_TRADE_TOKEN
                },
                data: {
                    networkName: BlockchainStrings.NETWORKNAME,
                    contractName: BlockchainStrings.CONTRACTNAME,
                    values: values
                }
            })
            .then(response => {
                return resolve(response.data);
            })
            .catch(err => {
                return reject(err);
            })
        })
    },
    updateAssetInstance: async (asset, assetId, values) => {
        return new Promise((resolve, reject) => {

            axios({
                method: 'PUT',
                url: `http://3.87.134.173:8081/asset/${asset}/${assetId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.SAFE_TRADE_TOKEN
                },
                data: {
                    networkName: BlockchainStrings.NETWORKNAME,
                    contractName: BlockchainStrings.CONTRACTNAME,
                    values: values
                }
            })
            .then(response => {
                return resolve(response.data);
            })
            .catch(err => {
                return reject(err);
            })
        })
    },
    deleteAssetById: async (asset, assetId) => {
        return new Promise((resolve, reject) => {
            axios({
                method: 'DELETE',
                url: `${BlockchainStrings.URL}/asset/${asset}/${assetId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.SAFE_TRADE_TOKEN
                },
                data: {
                    networkName: BlockchainStrings.NETWORKNAME,
                    contractName: BlockchainStrings.CONTRACTNAME
                }
            })
            .then(response => {
                return resolve(response.data);
            })
            .catch(err => {
                return reject(err);
            })
        })
    },
    getAllBlockData: async () => {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: `${BlockchainStrings.URL}/transaction/info/allBlockData/?networkName=${BlockchainStrings.NETWORKNAME}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.SAFE_TRADE_TOKEN
                }
            })
            .then(response => {
                return resolve(response.data);
            })
            .catch(err => {
                return reject(err);
            })
        })
    }
};
