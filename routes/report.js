const express = require('express');
const router = express.Router();
const Helpers = require('../utils/helpers');
const blockchainConnector = require('../utils/blockchainConnector');

router.get('/', (req, res) => {
    let token = req.headers.authorization;
    Helpers.verifyToken(token, (err, user) => {
        if(err){
            res.status(500).json(err);
        }
        blockchainConnector.queryAllAssets('report')
        .then(reports => {
            res.json(reports);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
});

router.get('/:id', (req, res) => {
    let token = req.headers.authorization;
    let id = req.params.id;
    Helpers.verifyToken(token, (err, user) => {
        if(err){
            res.status(500).json(err);
        }
        blockchainConnector.queryAssetById('report', id)
        .then(report => {
            if(!report){
                return res.status(404).json('no report with key: ', id);
            }
            res.json(report);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
});

router.post('/', (req, res) => {
    let token = req.headers.authorization;
    let type = req.body.type;
    let size = req.body.size;
    let color = req.body.color;
    let userName = req.body.userName;
    let link = req.body.link;
    let values = {
        type: type,
        size: size,
        color: color,
        userName: userName,
        link: link
    };
    Helpers.isAdmin(token)
    .then(() => {
        blockchainConnector.instantiateAsset('report', values)
        .then( report => {
            res.json(report);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
    .catch(err => {
        res.status(401).json('Unauthorized');
    })
});

router.put('/:id', (req, res) => {
    let token = req.headers.authorization;
    let id = req.params.id;
    let values = req.body.values;
    Helpers.verifyToken(token, (err, user) => {
        if(err){
            res.status(500).json(err);
        }
        blockchainConnector.updateAssetInstance('report', id, values)
        .then( report => {
            res.json(report);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
});

router.delete('/:id', (req, res) => {
    let token = req.headers.authorization;
    let id = req.params.id;
    Helpers.isAdmin(token)
    .then(() => {
        blockchainConnector.deleteAssetById('report', id)
        .then( report => {
            res.json(report);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
    .catch(err => {
        res.status(401).json('Unauthorized');
    })
});

module.exports = router;
