import { SocialEntry } from '~nuxt-social-entry/runtime';

export default function (ctx, inject) {
  const options = <%= JSON.stringify(options.options, null, 2) %>

  // Create a new instance
  const $socialEntry = new SocialEntry(ctx, options);

  inject('socialEntry', $socialEntry);
}
