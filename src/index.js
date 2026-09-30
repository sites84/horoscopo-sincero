import { handleGenerate } from "./gerar.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/gerar-horoscopo") return handleGenerate(request, env);
    return env.ASSETS.fetch(request);
  }
};
