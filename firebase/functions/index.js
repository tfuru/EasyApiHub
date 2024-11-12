require('date-utils');
const fs = require('fs');

// asia-northeast1 にデプロイするための設定
const { setGlobalOptions } = require("firebase-functions/v2");
setGlobalOptions({
  region: "asia-northeast1",
});

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// ベーシック認証
const basicAuth = require('basic-auth-connect')

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({ origin: true }));

const { Api } = require('./modules/Api');
const api = new Api();

const { KeyValue } = require('./modules/KeyValue');
const keyValue = new KeyValue();

// テスト用
app.get('/api', async (req, res) => {
  process.env.TZ = 'Asia/Tokyo';

  res.json({
    status: 'ok',
    time: new Date().toFormat('YYYY-MM-DD HH24:MI:SS')
  });
});

app.post('/api', async (req, res) => {
  const request = JSON.parse(req.body.request);
  const cmd = request.cmd.toUpperCase();
  // logger.log(`req.body`, req.body);
  // logger.log(`request`, request);
  // logger.log(`cmd`, cmd);

  switch (cmd) {
      case "API":
          {
              // verify の 取得
              const verify = await keyValue.getVerify(request.identifier);
              if (!verify) {
                  res.json({
                      'verify': "verify not found",
                      'response': "verify not found"
                  });
                  return;
              }
              const response = await api.request(request);
              const result = {
                  'verify': verify,
                  'response': JSON.stringify(response)
              };
              res.json(result);
          }
          break;                       
      default:
          {
              const result = {
                  'verify': "verify not found",
                  'response': "cmd not found"
              };
              res.json(result);
          }
          break;
  }
});

// verify 登録 ベーシック認証
app.all('/verify', basicAuth(function(user, password) {
  const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
  const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS;    
  return user === BASIC_AUTH_USER && password === BASIC_AUTH_PASS;
}));

// verify 画面
app.get('/verify', async (req, res) => {
  const body = fs.readFileSync('template/verify.html', 'utf8');
  res.status(200).send( body );
});

app.post('/verify', async (req, res) => {
  logger.log(`req.body`, req.body);
  const identifier = req.body.identifier;
  const verify = req.body.verify;

  const result = await keyValue.setVerify(identifier, verify);
  res.json(result);
});

// login 画面
app.get('/login', async (req, res) => {
  // template/login.html の内容を取得
  const body = fs.readFileSync('template/login.html', 'utf8');  
  res.status(200).send( body );
});

exports.api = onRequest(app);
