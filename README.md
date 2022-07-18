# A2Workspace/Nuxt-Social-Entry

Nuxt.js 的 [a2workspace/laravel-social-entry](https://github.com/A2Workspace/laravel-social-entry) 集成模組。

## Setup | 安裝

此套件尚未發布到 **NPM** 需透過下列方法安裝：

```bash
npm install -s git+https://github.com/A2Workspace/nuxt-social-entry.git
```

或使用 `yarn`:

```bash
yarn add git+https://github.com/A2Workspace/nuxt-social-entry.git
```

接著將模組設定增加到 `nuxt.config.js` 的 `modules` 區塊:

```js
export default {
  modules: ['@a2workspace/nuxt-social-entry'],
};
```

## Configure | 設置

透過增加 `socialEntry` 設定到 `nuxt.config.js` 中，你可以修改預設使用的路徑。

```js
export default {
  modules: ['@a2workspace/nuxt-social-entry'],

  socialEntry: {
    endpoints: {
      authorization:
        process.env.SOCIAL_ENTRY || 'http://localhost:8000/auth/socialite',
      token: '/auth/socialite/token',
      login: '/auth/socialite/login',
      connect: '/auth/socialite/connect',
      disconnect: '/auth/socialite/disconnect',
    },
  },
};
```

- `authorization`: 當進行第三方登入或授權時，將會將使用者重導到該網址。
- `token`: 當使用者從第三方授權返回時，將會透過 `axios` 請求該接口完成授權，並取得 **臨時的 acceess_token** 與使用者社群資訊。
- `login`: 當使用者完成授權時，將會透過 `axios` 使用該接口，並用 **臨時的 acceess_token** 換取正式的 `access_token` (通常為 JWT)
- `connect`: 當使用者完成授權時，將會透過 `axios` 使用該接口，並用 **臨時的 acceess_token** 與當前登入的帳號進行綁定。
- `disconnect`: 當使用者要解除第三方帳號綁定時，將會透過 `axios` 使用該接口。

## Usage | 如何使用

設置完成後你可以透過下列方式重導到第三方平台進行授權:

```js
this.$socialEntry.authorize('line').redirect();
```

### 使用第三方授權登入

這邊是個簡單範例如何重導到第三方授權，並在重導回來時完成授權:

```js
export default {
  name: 'LoginPage',

  methods: {
    handleLoginByLineApp() {
      this.$socialEntry.authorize('line').redirect();
    },
    handleLoginByGoogle() {
      this.$socialEntry.authorize('google').redirect();
    },
  },

  async mounted() {
    if (!this.$socialEntry.hasAuthCode()) {
      return;
    }

    const authResponse = await this.$socialEntry.completeAuthorization();

    // 判斷該帳號尚未註冊，將使用者跳轉到註冊頁面
    if (authResponse.data.isNewUser) {
      this.$router.push('register');

      return;
    }

    const accessToken = this.$socialEntry.getAccessToken(authResponse);
    const response = await this.$socialEntry.loginWithToken(accessToken);

    if (response.data.acceess_token) {
      this.$auth.setUserToken(
        response.data.acceess_token,
        response.data.refresh_token
      );
    }
  },
};
```

### 連結第三方平台帳號

這邊是個簡單範例用在個人資料頁面連結社群帳號功能:

```js
export default {
  name: 'ProfilePage',

  methods: {
    handleConnectingLineApp() {
      this.$socialEntry.authorize('line').redirect();
    },
    handleDisonnectingLineApp() {
      this.$socialEntry.disconnect('line', this.$auth.user.line_id);
    },
  },

  async mounted() {
    if (!this.$socialEntry.hasAuthCode()) {
      return;
    }

    const authResponse = await this.$socialEntry.completeAuthorization();

    const accessToken = this.$socialEntry.getAccessToken(authResponse);
    const response = await this.$socialEntry.connectWithToken(accessToken);

    if (response.data.status) {
      await this.$fetch();

      this.$message.info(`成功連結 ${authResponse.data.provider} 帳號`);
    }
  },
};
```

---

## Run demo | 運行範例

可以使用 [a2workspace/laravel-social-entry-demo](https://github.com/A2Workspace/laravel-social-entry-demo) 作為後端測試。

首先自 Github 上下載專案:

```bash
git clone https://github.com/A2Workspace/nuxt-social-entry.git
cd nuxt-social-entry
```

安裝所需相依套件:

```bash
npm install
# OR
yarn
```

開啟測試頁面在 [localhost:3000](http://localhost:3000):

```bash
npm run dev
```
