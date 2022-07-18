<template>
  <div class="relative flex h-screen w-full">
    <div class="h-full w-1/2 xl:w-2/3 bg-gray-200">
      <div class="mx-auto flex h-full flex-col justify-center">
        <div class="mt-8 mx-4" v-show="userProfile">
          <div class="w-full p-8">
            <h2 class="mb-4 text-m">User Profile</h2>
            <pre class="overflow-auto p-4 bg-gray-100 text-xs">{{ userProfile }}</pre>
          </div>
        </div>
        <div class="mt-8 mx-4" v-show="accessResponsePayload">
          <div class="w-full p-8">
            <h2 class="mb-4 text-m">AccessTokenResponse.data:</h2>
            <pre class="overflow-auto p-4 bg-gray-100 text-xs">{{ accessResponsePayload }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div class="h-full w-1/2 xl:w-1/3">
      <div class="mx-auto w-2/3 flex h-full flex-col justify-center">
        <div class="">
          <h2 class="text-2xl font-semibold text-gray-700 text-center">歡迎回來</h2>
        </div>
        <div class="my-4">
          <c-buttom provider="github" bg="#24292f" color="#fff">綁定 <strong>Github</strong> 帳號</c-buttom>
          <c-buttom provider="google" bg="#de5246" color="#fff">綁定 <strong>Google</strong> 帳號</c-buttom>
          <c-buttom provider="facebook" bg="#1877F2" color="#fff">綁定 <strong>Facebook</strong> 帳號</c-buttom>
          <c-buttom provider="line" bg="#00C300" color="#fff">綁定 <strong>Line</strong> 帳號</c-buttom>
        </div>
        <div class="mt-8">
          <button class="bg-gray-400 text-white font-bold py-3 px-4 w-full rounded hover:bg-gray-300" @click="handleLogout">登出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { handleErrorResponse } from './login';

export default {
  middleware: 'auth',

  data() {
    return {
      accessResponsePayload: null,
      loginResponsePayload: null,
      errorMessage: null,
    };
  },

  methods: {
    async handleLogout() {
      await this.$auth.logout();

      this.$router.push('/login');
    },
  },

  computed: {
    userProfile() {
      return this.$auth.user;
    }
  },

  async mounted() {
    if (this.$socialEntry.hasAuthCode()) {
      try {
        await this.$socialEntry.completeAuthorization({ autoResetParams: !this.$config.isDev });

        const accessResponse = await this.$socialEntry.connectWithToken();

        this.accessResponsePayload = accessResponse.data;
      } catch (error) {
        handleErrorResponse(error);
      }
    }
  },
};
</script>
