# KeyValue サンプル
Creater Kit 外部通信機能を使って利用できる KeyValue の説明

# Creater Kit 外部通信先エンドポイントURL を設定後に発行される verify を
KeyValueサーバーに設定する必要があります。
1. 外部通信先エンドポイントURL を Creater Kit に設定
2. verify を サーバーに設定

## verify を サーバーに設定

外部通信先エンドポイント URL 登録時に発行される文字列を サーバーに設定する  
外部通信先エンドポイントURL  
https://[firebase project名].web.app/api

| 項目 | 値 |  
|:--|:---|  
| ユーザー | xxxxxxx  |  
| パスワード | xxxxxxx  |  

|項目名| 内容 | 備考 |
|---|---|---|
|identifier| クラスターのワールドID など 利用ワールドや機能を識別するためのID  | |
|verify| 外部通信登録時に発行される文字列 | |

```
# テスト用サーバ
curl -X POST -H "Content-Type: application/json" -u xxxxxxx:xxxxxxx -d "{\"identifier\":\"dummy-world-id\", \"verify\":\"547057AB-865D-41A2-AF37-05AAA38C1C68\"}" http://127.0.0.1:5001/[firebase project名]/asia-northeast1/api/verify

# identifier を `dummy` で登録
curl -X POST -H "Content-Type: application/json" -u admin-i4wkyvmb:q359g7eu -d "{\"identifier\":\"dummy\", \"verify\":\"547057AB-865D-41A2-AF37-05AAA38C1C68\"}" https://[firebase project名].web.app/verify
```

# Creater Kit での利用

## KeyValue サンプル

## KeyValue にデータを保存する

```javascript
const IDENTIFIER = "dummy";
const CMD = "API";
const API_TYPE = "keyvalue";

const API_CMD = "SAVE";

const API_REQUEST_DATA = {
  identifier: IDENTIFIER,
  cmd: CMD,
  type: API_TYPE,
  parameter: {
    cmd: API_CMD,
    idfc: "",
    userid: "",
    value: {}
  }
}

const META_INPUT_TEXT = "INPUT_TEXT";

// KeyValue API にリクエストを送信する
const sendKeyValueRequest = (player, cmd, value = {}) => {
  if (player == null) return;

  const data = Object.assign({}, API_REQUEST_DATA);
  data.parameter.idfc = player.idfc;
  data.parameter.userid = player.userid;
  data.parameter.cmd = cmd;
  data.parameter.value = value;

  $.callExternal(JSON.stringify(data), CMD);
}

$.onStart(() => {
  $.state.player = null;
});

$.onInteract(player => {
  $.state.player = player;
  player.requestTextInput(META_INPUT_TEXT, "サーバーに保存するメッセージを入力してください");
});

$.onTextInput((text, meta, status) => {
  if (meta !== META_INPUT_TEXT) {
    // 他のメタデータの場合は処理しない
    $.state.player = null;
    return;
  }

  switch(status) {
    case TextInputStatus.Success:
        const player = $.state.player;
        // リクエストを送信する
        sendKeyValueRequest(player, API_CMD, {text: text});
        break;
    default:
        // キャンセルされた場合 state.player を null に戻す
        $.state.player = null;
        break;
  }
});

const setText = (textView, text, length) => {
  if (textView == null) return;
  // data.text を 10文字ずつ改行して表示する
  const lines = [];
  for (let i = 0; i < text.length; i += length) {
    lines.push(text.slice(i, i + length));
  }
  textView.setText(lines.join("\n"));
}

// レスポンスを受け取る
$.onExternalCallEnd((response, meta, errorReason) => {
  $.log(`response ${response}`);
  // $.log(`meta ${meta}`);
  $.log(`errorReason ${errorReason}`);
  if (errorReason != null) {
      return;
  }

  if (meta === CMD) {
    const data = JSON.parse(response);
    const textView = $.subNode("TextView");
    if (textView) {
      const value = JSON.stringify(data.response.value);
      $.log(`value > ${value}`);

      setText(textView, value, 20);
    }
  }
});
```

## KeyValue に保存されたデータを取得する

```javascript
const IDENTIFIER = "dummy";
const CMD = "API";
const API_TYPE = "keyvalue";

const API_CMD = "LOAD";

const API_REQUEST_DATA = {
  identifier: IDENTIFIER,
  cmd: CMD,
  type: API_TYPE,
  parameter: {
    cmd: API_CMD,
    idfc: "",
    userid: "",
    value: {}
  }
}

const META_INPUT_TEXT = "INPUT_TEXT";

// KeyValue API にリクエストを送信する
const sendKeyValueRequest = (player, cmd, value = {}) => {
  if (player == null) return;

  const data = Object.assign({}, API_REQUEST_DATA);
  data.parameter.idfc = player.idfc;
  data.parameter.cmd = cmd;
  data.parameter.value = value;

  $.callExternal(JSON.stringify(data), CMD);
}

$.onInteract(player => {
  sendKeyValueRequest(player, API_CMD);
});

const setText = (textView, text, length) => {
  if (textView == null) return;
  // data.text を 10文字ずつ改行して表示する
  const lines = [];
  for (let i = 0; i < text.length; i += length) {
    lines.push(text.slice(i, i + length));
  }
  textView.setText(lines.join("\n"));
}

// レスポンスを受け取る
$.onExternalCallEnd((response, meta, errorReason) => {
  $.log(`response ${response}`);
  // $.log(`meta ${meta}`);
  $.log(`errorReason ${errorReason}`);
  if (errorReason != null) {
      return;
  }

  if (meta === CMD) {
    const data = JSON.parse(response);
    $.log(`data > ${data}`);
    const textView = $.subNode("TextView");
    if (textView) {
      // data.response.value が 保存した値
      const value = JSON.stringify(data.response.value);
      $.log(`value > ${value}`);
      
      setText(textView, value, 20);
    }
  }
});
```
