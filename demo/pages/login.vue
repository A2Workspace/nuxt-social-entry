<template>
  <div class="relative flex h-screen w-full">
    <div class="h-full w-1/2 xl:w-1/3">
      <div class="mx-auto w-2/3 flex h-full flex-col justify-center">
        <div class="my-4">
          <p class="text-m text-gray-600 text-center my-4">用以下帳號繼續</p>
          <c-buttom provider="github" bg="#24292f" color="#fff">使用 <strong>Github</strong> 帳號登入</c-buttom>
          <c-buttom provider="google" bg="#de5246" color="#fff">使用 <strong>Google</strong> 帳號登入</c-buttom>
          <c-buttom provider="facebook" bg="#1877F2" color="#fff">使用 <strong>Facebook</strong> 帳號登入</c-buttom>
          <c-buttom provider="line" bg="#00C300" color="#fff">使用 <strong>Line</strong> 帳號登入</c-buttom>
        </div>
        <div class="my-4">
          <fieldset class="border-t border-solid border-gray-400">
            <legend class="mx-auto px-2 text-center text-sm">或使用帳號登入</legend>
          </fieldset>
        </div>
        <div class="mt-2">
          <input class="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-3 px-4 block w-full appearance-none" placeholder="使用者帳號" v-model="form.username">
        </div>
        <div class="mt-2">
          <input class="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-3 px-4 block w-full appearance-none" type="password" placeholder="密碼" v-model="form.password">
        </div>
        <div class="mt-3">
          <button class="bg-gray-700 text-white font-bold py-3 px-4 w-full rounded hover:bg-gray-600" @click="handleLogin">登入</button>
        </div>
      </div>
    </div>

    <div class="h-full w-1/2 xl:w-2/3 bg-gray-200">
      <div class="mx-auto flex h-full flex-col justify-center">
        <div class="mt-2 mx-4" v-if="accessTokenResponse">
          <div class="w-full p-4">
            <h2 class="mb-4 text-m">AccessTokenResponse.data:</h2>
            <pre class="overflow-auto p-4 bg-gray-100 text-xs">{{ accessTokenResponse.data }}</pre>
          </div>
        </div>
        <div class="mt-2 mx-4" v-if="loginResponse">
          <div class="w-full p-4">
            <h2 class="mb-4 text-m">LoginResponse.data:</h2>
            <pre class="overflow-auto p-4 bg-gray-100 text-xs">{{ loginResponse.data }}</pre>
          </div>
        </div>
        <div class="mt-2 mx-4" v-show="userProfile">
          <div class="w-full p-4">
            <h2 class="mb-4 text-m">User Profile</h2>
            <pre class="overflow-auto p-4 bg-gray-100 text-xs">{{ userProfile }}</pre>
            <p class="mt-2 text-m">已成功登入(<nuxt-link to="/">點我刷新頁面</nuxt-link>)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accessTokenResponse: null,
      loginResponse: null,
      errorMessage: null,
      form: {
        username: null,
        password: null,
      },
    };
  },

  methods: {
    async handleLogin() {
      const { username, password } = this.form;
      const credentials = { username, password };

      let loginResponse;

      try {
        loginResponse = await this.$auth.loginWith('laravel', { data: credentials });
      } catch (error) {
        handleErrorResponse(error);
        return;
      }

      if (loginResponse) {
        this.$router.push('/');
      }
    },
  },

  computed: {
    userProfile() {
      return this.$auth.user;
    }
  },

  async mounted() {
    if (this.$auth.loggedIn) {
      return this.$router.push('/');
    }

    if (this.$socialEntry.hasAuthCode()) {
      try {
        this.accessTokenResponse = await this.$socialEntry.completeAuthorization({ autoResetParams: !this.$config.isDev });

        if (this.$socialEntry.isNewUserAccess(this.accessTokenResponse)) {
          alert('該帳號尚未綁定');
          return;
        }

        this.loginResponse = await this.$socialEntry.loginWithToken();
      } catch (error) {
        handleErrorResponse(error);
      }
    }
  },
};

export function handleErrorResponse(error) {
  if (error.isAxiosError) {
    const { response } = error;
    const message = response.data.message || response.data.error || 'No message';
    alert(`${message} (status_code: ${response.status})`);
  }

  console.error(error);
}
</script>
