const IDENTIFIER = "dummy";
const CMD = "API";

const API_REQUEST_DATA = {
  identifier: IDENTIFIER,
  cmd: CMD,
  type: "keyvalue",
  parameter: {
    cmd: "LOAD",
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