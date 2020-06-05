# 前提条件
- Nodeの基本
- ECMAScript

# Express
- Webサーバーのプログラミング
- モジュール
- Nodeで必須

# 準備
- インストール

  ```
  mkdir node-web-server
  cd node-web-server
  npm init
  # -> 全部エンター

  # Express Install
  npm install express

  # 便利機能(ソース修正したら自動再起動してくれる)
  npm install -g --force nodemon
  ```

- node-web-server/server.jsを作成
  
  ```
  const express = require("express");
  const app = express();
  ```

- node-web-server/package.jsonを修正

  ```
  "main": "index.js",
  ↓
  "main": "server.js",
  ```

# GET
## Hello Express!

- server.js
```
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(3000);
```

- 起動
```
node server
# or
nodemon server
```

- アクセス
```
http://localhost:4000/
```

# ルーティング
- app.getを追加するだけ
  - HTML情報も送れるよ
  - Jsonも送れるよ


# 静的ファイル（Static）
- node-web-server/public フォルダを作成
- public/ に画像をいれる
  - 今回はwhite-bear.png

- server.js追加
  - app.get()の上に

  ```
  app.use(express.static(__dirname + "/public"));
  ```

  - __dirname は「npm init」したパス情報が入ってるグローバルなやつ
    - 今回はnode-web-server

- アクセス

  ```
  http://localhost:4000/help.html
  ```

※ HTMLファイルも同じ感じで表示できるよ


# View enjine

## 種類

- ejs
- pug
- handlebars
- hogan

## handlebars使います

- 準備
  ```
  npm install hbs
  ```

- server.js
  - app.use の上

  ```
  const hbs = require("hbs");

  app.set("view engine", "hbs");
  ```

- node-web-server/views フォルダを作成
- viewsにabout.hbs　を作成
  - 拡張子は「.hbs」（ひげがカワイイ）
  - HTMLと一緒

- server.js
  ```
  app.get("/about", (req,res) => {
    res.render("about.hbs");
  })
  ```
  
  - viewsフォルダ内にあれば↑こんな感じで指定すればOK


# 動的ページ(hbs)

## ポイント
- render() に引数
- hbs に特殊な書き方

## やってみる
- server.js
  ```
  app.get("/about", (req,res) => {
    res.render("about.hbs", {
      pageTitle: "About Page",
      content: "コンテンツです。",
      currentYear: new Date().getFullYear()
    });
  })
  ```

- about.hbs
  ```
  <!DOCTYPE html>
  <html>
    <head>
      <title>{{ pageTitle }}</title>
      <meta charset="UTF-8">
    </head>
    <body>
      <h1>{{ pageTitle }}</h1>
      <p>{{ content }}</p>
      <footer>
        <p>Copyright {{ currentYear }}</p>
      </footer>
    </body>
  </html>
  ```

## 同じ感じで"/"を"home.hbs"で表示できるようにする

# Partial(分割)

## 共通HTML

- 準備
  - node-web-server/views/partials フォルダを作成

- server.js
  ```
  app.set("view engine", "hbs");
  hbs.registerPartials(__dirname + "/views/partials");  // <- Add!! ※先頭の/忘れないように!
  app.use(express.static(__dirname + "/public"));
  ```

- 共通化する部分を作成する
  - partials/footer.hbs を作成
  ```
  <footer>
    <p>Copyright {{ currentYear }}</p>
  </footer>
  ```

- 呼び出すページに埋め込む
  - home.hbs
  ```
  <!DOCTYPE html>
  <html>
    <head>
      <title>{{ pageTitle }}</title>
      <meta charset="UTF-8">
    </head>
    <body>
      <h1>{{ pageTitle }}</h1>
      <p>{{ content }}</p>
      
      <!-- ここね -->
      {{> footer }}
    </body>
  </html>
  ```

# Helper

## 共通関数 (helper関数)
<!-- 
- 準備
  - node-web-server/views/helper フォルダを作成 -->

- server.js
  ```
  app.set("view engine", "hbs");
  hbs.registerPartials(__dirname + "/views/partials");  
  hbs.registerHelper("getCurrentYear", () => {            // <- Add!! 引数1: 関数名, 引数2: 処理内容
    return new Date().getFullYear()
  });
  app.use(express.static(__dirname + "/public"));

  ...
  currentYear: new Date().getFullYear()       // <- Delete!! getCurrentYearを使用するので削除
  ...
  ```

- footer.hbs
  ```
  {{ currentYear }}
  ↓
  {{ getCurrentYear }}
  ```

## 引数を使用する場合

- server.js
  ```
  hbs.registerHelper("uppercase", text => {
    return text.toUpperCase();
  });
  ```

- XXX.hbs
  - 関数名 スペース 引数の順で記述するだけ
  ```
  <h1>{{ uppercase pageTitle }}</h1>
  ```

## 補足
### helper.jsにしてhelperを別管理したい時

- views/helper.js を作成
  - コードを移動する
  ```
  const hbs = require("hbs");
  hbs.registerHelper("getCurrentYear", () => {
    return new Date().getFullYear();
  });
  hbs.registerHelper("uppercase", text => {
    return text.toUpperCase();
  });
  ```

- server.js
  - これさえあればOK
  ```
  const hbs = require("hbs");
  require("./views/helper");
  ```

# ファイル書込み

- server.logを作成して、そこにアクセスログを出力する
- server.js
  ```
  const fs = require("fs");

  app.use((req, res, next) => {
    let now = new Date();
    let log = `${now}: ${req.method} ${req.url}`
    console.log(log);
    fs.appendFile("server.log", log + "\n", err => {
      if (err) {
        console.log(err);
      }
    });
    next();   // 必須、ないと処理終わらない
  });
  ```

# メンテナンス画面にする

- views/maintenance.hbs を作成する
- server.js
  - あえてnext()を書かない
  - どのURLにいってもメンテナンス画面が表示されるようになる
  - 実際は使わないね
  ```
  app.use((req, res, next) => {
    res.render("maintenance.hbs");
  })
  app.use(express.static(__dirname + "/public"));　 // <-- 移動する
  ```


# RESTful

## DRUD

- GET  - 取得 - Read
- POST - 送信 - Create
- PUT  - 編集 - Updade
- DELETE - 削除 - Delete

- 準備
  ```
  pwd 
  >> ~/<project>
  mkdir express-api
  npm init
  npm i express --save
  npm install -g --force nodemon
  ```

- express-api/index.js を作成
  ```
  const express = require("express");
  const app = express();
  const port = process.env.PORT || 4000;  // なかったら4000適用

  app.get("/", (req, res) => {
    res.send("Hello, World");
  })

  app.listen(port, () => {
    console.log(`PORT: ${port}`);
  })
  ```

# GET

## 表示
- index.js
  ```
  app.get("/", (req, res) => {
    res.send("Hello, World");
  })
  ```

## パラメータ取得
- **パラメータは「req.params」に入ってる**

- index.js
  ```
  app.get("/drills/:id", (req, res) => {
    res.send(req.params.id);
  })
  ```

- URL
  ```
  http://localhost:4000/drills/100
  ```

- 結果
  ```
  100
  ```

## 連続したパラメータ
- index.js
  ```
  app.get("/learn/:subject/:page", (req, res) => {
    res.send(`${req.params.subject}の${req.params.page}ページ目です。`);
  })
  ```

- URL
  ```
  http://localhost:4000/learn/プログラミング/10
  ```

- 結果
  ```
  プログラミングの10ページ目です。
  ```

## クエリ

- index.js
  ```
  app.get("/learn/:subject/:page", (req, res) => {
    res.send(res.send(req.query););
  });
  ```

- URL1
  ```
  http://localhost:4000/learn/プログラミング/10?impression=Cool
  ```

- 結果1
  - jsonで取れる
  ```
  {"impression":"Cool"}
  ```

- URL2
  ```
  http://localhost:4000/learn/プログラミング/10?id=100
  ```

- 結果2
  - jsonで取れる
  ```
  {"id":"100"}
  ```

## パスによるデータ表示

- index.js
  ```
  const drills = [
    {id: 1, name: "Programing"},
    {id: 2, name: "English"},
    {id: 3, name: "Science"},
  ]

  app.get("/", (req, res) => {
    res.send("Hello, World");
  });

  app.get("/drills", (req, res) => {
    res.send(drills);
  });


  app.get("/drills/:id", (req, res) => {
    let = drill = drills.find(e => e.id === parseInt(req.params.id));
    if(!drill) {
      res.send("該当のIDのドリルが見つかりません")
    }
    res.send(drill);
  });
  ```

- URL
  ```
  http://localhost:4000/drills/2
  ```

- 結果
  ```
  {"id":2,"name":"English"}
  ```

# POST

## 基本
- **送信パラメータは「req.body」に入ってる**

- index.js
  ```
  app.use(express.json())   // Jsonを扱う物！formとは別!!


  app.post("/drills", (req, res) => {
    let drill = {
      id: drills.length + 1,
      name: req.body.name
    }
    drills.push(drill);
    res.send(drills);
  });
  ```

- Postmanでpostしてみる
  1. 「+」 でタブふやす
  2. GET -> POSTに変更
  3. URLいれる
  4. Body 選択
  5. raw 選択
  6. Text -> JSONに変更
  7. パラメータいれる
    ```
    {
      "name": "Math"
    }
    ```
  8. Sendで飛ばす


## Formから飛ばす

- 準備
  ```
  npm install body-parser --save
  ```

- index.js
  ```
  const bodyParser = require("body-parser");
  app.use(bodyParser.urlencoded({extended: true}));
  ```

- Postmanでpostしてみる
  1. 1.~4.まで省略
  5. x-www-form-urlencoded 選択
  6. パラメータいれる

      ```
      KEY -> name
      VALUE -> Arithmetic
      ```

  7. Sendで飛ばす


# バリデーション(validation)

- 準備
  ```
  npm install joi --save
  ```

- index.js
  ```
  const Joi = require("joi");     // Classだから先頭は大文字
  
  ...

  app.post("/drills", (req, res) => {

    const schema = {
      name: Joi.string().min(3).required()
    };

    let result = Joi.validate(req.body, schema);
    if (result.error) {
      res.send(result.error.details[0].message);
    } else {
      let drill = {
        id: drills.length + 1,
        name: req.body.name
      };
      drills.push(drill);
      res.send(drills);
    };
  });

  ```

## バリデーションエラーを起こすと

- 1文字だけ入力して飛ばす
- 結果
  - ちゃんと、nameは3文字以上じゃないとダメよ！ってObjectで返ってくる
  ```
  {
    "isJoi": true,
    "name": "ValidationError",
    "details": [
        {
            "message": "\"name\" length must be at least 3 characters long",
            "path": [
                "name"
            ],
            "type": "string.min",
            "context": {
                "limit": 3,
                "value": "1",
                "key": "name",
                "label": "name"
            }
        }
    ],
    "_object": {
        "name": "1"
    }
  }
  ```

- メッセージだけを取り出すなら(index.js)
  ```
  if (result.error) {
    res.send(result.error.details[0].message);    // <-- ここね
  }
  ```

- 結果
  ```
  "name" length must be at least 3 characters long
  ```

# PUT

- index.js
  ```
  const drills = [
    {id: 1, name: "Programing"},
    {id: 2, name: "English"},
    {id: 3, name: "Science"},
  ]

  app.put("/drills/:id", (req, res) => {
    // id Check
    let drill = getDrill(req.params.id);
    if(!drill) {
      res.send("該当のIDのドリルが見つかりません")
    };

    // validation
    let {error} = validate(req.body);
    if (error) {
      res.send(error.details[0].message);
    }

    // update
    // forEachでリストを回して検索・更新
    drills.forEach(e => {
      if (e.id === parseInt(req.params.id)) {
        e.name = req.body.name;
      }
    });
    res.send(drills);
  });


  function getDrill(id) {
    return drills.find(e => e.id === parseInt(id));
  }


  function validate(drill) {
    const schema = {
      name: Joi.string().min(3).required()
    };
    return result = Joi.validate(drill, schema);
  }

  ```

- 検索・更新の部分はこれでもいける
  - getDrillで対象オブジェクトを取り出しててあるからそいつを使ってIndexを検索!

  ```
  drills.forEach(e => {
    if (e.id === parseInt(req.params.id)) {
      e.name = req.body.name;
    }
  });

  ↓

  let idx = drills.indexOf(drill);
  drills[idx].name = req.body.name;
  ```


# DELETE

- index.js
  ```
  app.delete("/drills/:id", (req, res) => {
    // id Check
    let drill = getDrill(req.params.id);
    if(!drill) {
      res.send("該当のIDのドリルが見つかりません")
    };

    // delete
    let idx = drills.indexOf(drill);
    drills.splice(idx, 1);

    res.send(drills);
  });
  ```

# ルーティング(route)
- **module.exports**
- **routes.jsの呼び出し**

- 準備
  - express-api/routes フォルダを作成
  - express-api/routes/routes.js を作成

- routes.js
  - drills関連全部をroutes.jsに移動
  - expressの読み込み方をroute用に修正
  - app を全て router　に修正
  - module.exports を最後に追加
  ```
  const express = require("express");
  const app = express();

  ↓

  const express = require("express");
  const router = express.Router();

  module.exports = router;        // 最後にAdd!!
  ```

- index.js
  ```
  const routes = require("./routes/routes");    // Add !!

  ...

  app.use("/", routes);       // Add!!

  ```

## RoutesのURLを整理する

- index.js
  ```
  app.use("/", routes);

  ↓

  app.use("/drills", routes);
  ```

- routes.js
  - 全て修正
  ```
  router.get("/drills", (req, res) => {

  ↓

  router.get("/", (req, res) => {
  ```


# エラー解決

## ERR_HTTP_HEADERS_SENT

- エラー内容

```
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

- 解決
res.send()が2回以上呼ばれないようにする
1回送信してるのにその後にまた送信しようとしちゃダメよ！ってことみたい

- 原因
```
if (result.error) {
  res.send("error");
};

<...処理...>
res.send("success");
```

- 修正方法
```
if (result.error) {
  res.send("error");
} else {
  <...処理...>
  res.send("success");
}
```