# KeyValueApi Module
KeyValueStore に対応させるための仕組みを提供する

# 送信パラメータ 内容  
request として json文字列を /api に送信する

|項目名| 内容 | 備考 |
|---|---|---|
|identifier| ワールドID など 利用ワールドや機能を識別するためのユニークなID  | |
|cmd| コマンド | api |
|type| タイプ | KeyValue |
|parameter| パラメータ | cmd,value など |

## parameter 内容
|項目名| 内容 | 備考 |
|---|---|---|
| cmd | コマンド | SAVE, LOAD 必須 |
| idfc | ユーザーを一意に認識するために利用できる文字列 | 必須 |
| value | 保存する値 配列,連想配列など | cmd LOAD 時は不要 |
| userid | プレイヤーのユーザーID | cmd LOAD 時は不要 |

```
{
  "identifier": "dummy",
  "cmd": "api",
  "type": "KeyValue",
  "parameter": {
    "cmd": "SAVE",
    "idfc": "idfc-dummy",
    "userid": "userid-dummy",
    "value": {
      "key0": "value0",
      "key1": "value1"
    }
  }
}
```


# ローカルでのテスト実行

```
# ローカルでのサーバ実行
firebase emulators:start

# テスト用 identifier 登録
curl -X POST -H "Content-Type: application/json" -u xxxxx:xxxxx -d "{\"identifier\":\"dummy\", \"verify\":\"df3a37b7-aaf0-41ec-9e58-a7a9258f5e9d\"}" http://127.0.0.1:5001/easyapihub/asia-northeast1/api/verify

# cmd SAVE, idfc, userid, value
curl -X POST -H "Content-Type: application/json" -d '{"request":"{\"identifier\":\"dummy\",\"cmd\":\"api\",\"type\":\"KeyValue\",\"parameter\":{\"cmd\":\"SAVE\",\"idfc\":\"idfc-dummy\",\"userid\":\"userid-dummy\",\"value\":\"保存する文字列\"}}"}' http://127.0.0.1:5001/easyapihub/asia-northeast1/api/api | jq ".response | fromjson"

{
  "type": "KEYVALUE",
  "response": {
    "identifier": "dummy",
    "idfc": "idfc-dummy",
    "userid": "userid-dummy",
    "value": "保存する文字列",
    "timestamp_utc": 1729233735153
  }
}

# cmd LOAD, idfc
curl -X POST -H "Content-Type: application/json" -d '{"request":"{\"identifier\":\"dummy\",\"cmd\":\"api\",\"type\":\"KeyValue\",\"parameter\":{\"cmd\":\"LOAD\",\"idfc\":\"idfc-dummy\"}}"}' http://127.0.0.1:5001/easyapihub/asia-northeast1/api/api | jq ".response | fromjson"

{
  "type": "KEYVALUE",
  "response": {
    "identifier": "dummy",
    "idfc": "idfc-dummy",
    "userid": "userid-dummy",
    "value": "保存する文字列",
    "timestamp_utc": 1729233562750
  }
}
```
