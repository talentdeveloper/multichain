var express = require('express');
var router = express.Router();
var bitcoinClient = require('bitcoin-promise');
var client = new bitcoinClient.Client({
    host: 'localhost',
    port: '7449',
    user: 'multichainrpc',
    pass: '2BFDzj4tZYZEsxmrEBHPp1PQf3U4XM9AFa71ofJrBW4i',
    timeout: 10000
});

/**
 * Getting transaction information by its txid
 * @param {string} txid Hash representing current transaction.
 * @returns {object} Decoded object representing transaction with current txid.
 */
router.get('/read/:txid', function (req, res) {
    return client.getRawTransaction(req.params.txid)
        .then(function (result) {
            return client.decodeRawTransaction(result);
        })
        .then(function (decoded) {
            res.json(decoded);
        })
        .catch(function(err) {
            res.status(500).send(err)
        })
});

/**
 * Getting current chain block data by its hash or height
 * @param {string / number} block Hash or height representing current block.
 * @returns {object} Object representing block of current chain.
 */
router.get('/read-header/:block', function (req, res) {
    return client.getBlock(req.params.block)
        .then(function (result) {
            res.json(result);
        })
        .catch(function(err) {
            res.status(500).send(err)
        })
});

/**
 * Writes raw transaction for further processing (sign, send, etc.)
 * @param {array} transactionsList List of transactions taking part in current transaction.
 * @param {object} addresses List of receiving addresses and additional metadata we want them to receive.
 * @returns {object} Decoded object representing just created raw transaction.
 */

router.post('/write', function (req, res) {
    return client.createRawTransaction(req.body.transactionsList, req.body.addresses)
        .then(function (result) {
            return client.decodeRawTransaction(result);
        })
        .then(function (decoded) {
            res.json(decoded);
        })
        .catch(function(err) {
            res.status(500).send(err)
        })
});

module.exports = router;
