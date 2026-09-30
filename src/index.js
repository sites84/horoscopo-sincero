const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=UTF-8"
};

async function gerarHoroscopo(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const body = await request.json();
    const signo = String(body.signo || "").trim();
    const elemento = String(body.elemento || "").trim();
    const contexto = String(body.contexto || "").trim().slice(0, 280);

    if (!signo || !elemento) {
      return new Response(JSON.stringify({ error: "Signo e elemento são obrigatórios." }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const prompt = `Você é Madame Verônica, astróloga brasileira com 30 anos de experiência, direta, sarcástica, íntima e engraçada. Fale em português brasileiro, usando gírias naturais. Nunca seja cruel: o humor deve atingir comportamentos e hábitos, não aparência, saúde mental ou traumas.

Crie AGORA uma leitura ORIGINAL para o signo ${signo}, elemento ${elemento}.
${contexto ? `Contexto pessoal informado pelo usuário: ${contexto}` : "Não há contexto pessoal informado."}

A resposta precisa ser NOVA para esta solicitação e não pode parecer uma lista de frases prontas.

Retorne SOMENTE um objeto JSON válido, sem markdown, sem explicações e sem texto antes ou depois, exatamente com estas seis propriedades:
{"verdade":"2 ou 3 frases expondo um comportamento reconhecível do signo.","diario":"uma previsão divertida e específica para hoje.","semana":"3 ou 4 frases formando uma previsão comportamental específica da semana.","frase":"uma frase curta, extremamente compartilhável e engraçada.","exposicao":"uma nova exposição curta, diferente da verdade.","conselho":"uma frase útil que ataque exatamente o ponto fraco do signo."}`;

    let answer;
    let modeloUsado = "@cf/zai-org/glm-4.7-flash";

    try {
      answer = await env.AI.run(modeloUsado, {
        prompt,
        max_tokens: 700,
        temperature: 0.9
      });
    } catch (aiError) {
      // Fallback para modelo ativo do catálogo atual do Workers AI.
      modeloUsado = "@cf/meta/llama-3.2-3b-instruct";
      answer = await env.AI.run(modeloUsado, {
        prompt,
        max_tokens: 700,
        temperature: 0.9
      });
    }

    let raw = "";
    if (typeof answer === "string") {
      raw = answer;
    } else if (answer && typeof answer.response === "string") {
      raw = answer.response;
    } else if (answer && answer.result && typeof answer.result.response === "string") {
      raw = answer.result.response;
    } else if (answer && Array.isArray(answer.choices) && answer.choices[0]?.message?.content) {
      raw = answer.choices[0].message.content;
    }

    if (!raw) throw new Error(`O Workers AI não retornou conteúdo de texto. Modelo: ${modeloUsado}`);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) throw new Error(`A IA não retornou o formato esperado. Modelo: ${modeloUsado}`);
      parsed = JSON.parse(match[0]);
    }

    return new Response(JSON.stringify({
      verdade: String(parsed.verdade || ""),
      diario: String(parsed.diario || ""),
      semana: String(parsed.semana || ""),
      frase: String(parsed.frase || ""),
      exposicao: String(parsed.exposicao || ""),
      conselho: String(parsed.conselho || "")
    }), { status: 200, headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Não foi possível gerar o horóscopo agora.",
      detail: String(error.message || error)
    }), { status: 500, headers: corsHeaders });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/gerar-horoscopo") return gerarHoroscopo(request, env);
    return env.ASSETS.fetch(request);
  }
};
