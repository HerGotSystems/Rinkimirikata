import {
  onRequestGet as getWhatChanged,
  onRequestPost as postWhatChanged,
  onRequestOptions as optionsWhatChanged
} from "../functions/api/what-changed.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/what-changed") {
      const context = {
        request,
        env,
        waitUntil: ctx.waitUntil.bind(ctx),
        passThroughOnException: ctx.passThroughOnException.bind(ctx)
      };

      if (request.method === "GET") return getWhatChanged(context);
      if (request.method === "POST") return postWhatChanged(context);
      if (request.method === "OPTIONS") return optionsWhatChanged(context);

      return new Response(JSON.stringify({ ok: false, error: "method-not-allowed" }), {
        status: 405,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "allow": "GET, POST, OPTIONS",
          "cache-control": "no-store"
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
