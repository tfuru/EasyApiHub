const IDENTIFIER = "dummy";
const CMD = "API";

const API_REQUEST_DATA = {
  identifier: IDENTIFIER,
  cmd: CMD,
  type: "keyvalue",
  parameter: {
    cmd: "SAVE",
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