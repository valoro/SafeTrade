const express = require('express');
const router = express.Router();
const Helpers = require('../utils/helpers');
const blockchainConnector = require('../utils/blockchainConnector');

router.get('/', (req, res) => {
    let token = req.headers.authorization;
    Helpers.isAdmin(token)
    .then(() => {
        blockchainConnector.queryAllAssets('report')
        .then(reports => {
            res.json(reports);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
    .catch(err => {
        Helpers.isTechManager(token)
        .then(() => {
            blockchainConnector.queryAllAssets('report')
            .then(reports => {
                for (let i = 0; i < reports.length; i++) {
                    if(reports[i].Record.businessComment){
                        delete reports[i].Record.businessComment;
                    }
                }
                res.json(reports);
            })
            .catch(err => {
                res.status(500).json(err);
            })
        })
        .catch(err => {
            Helpers.isFinManager(token)
            .then(() => {
                blockchainConnector.queryAllAssets('report')
                .then(reports => {
                    for (let i = 0; i < reports.length; i++) {
                        if(reports[i].Record.technicalComment){
                            delete reports[i].Record.technicalComment;
                        }
                    }
                    res.json(reports);
                })
                .catch(err => {
                    res.status(500).json(err);
                })
            })
            .catch(err => {
                res.status(401).json('Unauthorized');
            })
        })
    })
});

router.get('/info', (req, res) => {
    let token = req.headers.authorization;
    Helpers.isAdmin(token)
    .then(() => {
        blockchainConnector.getAllBlockData()
        .then( data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
    .catch(err => {
        res.status(401).json('Unauthorized');
    })
});

router.get('/:id', (req, res) => {
    let token = req.headers.authorization;
    let id = req.params.id;
    Helpers.isAdmin(token)
    .then(() => {
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
    .catch(err => {
        res.status(401).json('Unauthorized');
    })
});

router.post('/', (req, res) => {
    let token = req.headers.authorization;
    let type = req.body.type;
    let size = req.body.size;
    let color = req.body.color;
    let values = {
        type: type,
        size: size,
        color: color,
        link: '',
        technicalComment: '',
        businessComment: ''
    };
    Helpers.verifyToken(token, (err, user) => {
        if(err){
            res.status(500).json(err);
        }
        values.userName = user.username;
        blockchainConnector.instantiateAsset('report', values)
        .then( report => {
            res.json(report);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
});

router.post('/technicalComment', (req, res) => {
    let token = req.headers.authorization;
    let id = req.body.id;
    let technicalComment = req.body.technicalComment;
    let values = {
        technicalComment: technicalComment
    };
    Helpers.isTechManager(token)
    .then(() => {
        blockchainConnector.updateAssetInstance('report', id, values)
        .then(report => {
            res.json(report);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
    .catch(err => {
        console.log(err);
        res.status(401).json('Unauthorized');
    })
});

router.post('/businessComment', (req, res) => {
    let token = req.headers.authorization;
    let id = req.body.id;
    let businessComment = req.body.businessComment;
    let values = {
        businessComment: businessComment
    };
    Helpers.isFinManager(token)
    .then(() => {
        blockchainConnector.updateAssetInstance('report', id, values)
        .then(report => {
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

router.post('/link', (req, res) => {
    let token = req.headers.authorization;
    let id = req.body.id;
    let link = req.body.link;
    let values = {
        link: link
    };
    Helpers.verifyToken(token, (err, user) => {
        if(err){
            res.status(500).json(err);
        }
        console.log('?');
        blockchainConnector.updateAssetInstance('report', id, values)
        .then(report => {
            res.json(report);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
});

router.put('/:id', (req, res) => {
    let token = req.headers.authorization;
    let id = req.params.id;
    let values = req.body.values;
    Helpers.isAdmin(token)
    .then(() => {
        blockchainConnector.updateAssetInstance('report', id, values)
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
