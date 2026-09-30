import { handleGenerate } from "../src/gerar.js";

export async function onRequest(context) {
  return handleGenerate(context.request, context.env);
}
