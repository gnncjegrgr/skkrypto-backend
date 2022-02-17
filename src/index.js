const express = require('express');
const Caver = require('caver-js');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mysql = require('mysql');
const ipfsClient = require('ipfs-http-client');
const asyncify = require('express-asyncify');
const router = asyncify(express.Router());
const dbconfig = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);
const schedule = require('node-schedule');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.set('port', process.env.PORT || 5000);

const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651',
};

const caver = new Caver(config.rpcURL);
const feePayer = caver.klay.accounts.wallet.add(
  //클레이튼 개인키로 추가해줍니다.
  '0x8cafa33df8c1740720bc4815ce7c7cd61d18aaf396bb2a3da5e197f0c7b85aff'
);
app.post('/test-api', async (req, res) => {
  const caver = req.body.firstName;
  console.log(caver);
});

app.post('/fee-delegated', async (req, res) => {
  const transaction = req.body.transaction;

  console.log('transaction', transaction);
  caver.klay
    .sendTransaction({
      senderRawTransaction: transaction,
      feePayer: feePayer.address,
    })
    .then(function (receipt) {
      console.log(receipt.transactionHash);
      res.json(receipt.transactionHash);
    });
});

app.post('/purchaseNFTwithERC20', async (req, res) => {
  const transaction = req.body.transaction;

  try {
    caver.klay
      .sendTransaction({
        senderRawTransaction: transaction,
        feePayer: feePayer.address,
      })
      .then(function (receipt) {
        console.log(receipt.transactionHash);
        res.json(receipt.transactionHash);
      });
  } catch {
    res.json(err);
  }
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
