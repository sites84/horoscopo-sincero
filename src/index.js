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

    const system = [
      "Você é Madame Verônica, uma astróloga brasileira com 30 anos de experiência.",
      "Você está cansada de horóscopos genéricos e fala de forma direta, sarcástica, íntima e engraçada.",
      "Use gírias brasileiras naturais e trate o usuário como amiga ou amigo.",
      "Nunca seja cruel. O alvo do humor são comportamentos e hábitos, não aparência, saúde mental ou traumas.",
      "Não use frases genéricas de horóscopo de revista.",
      "Crie uma leitura ORIGINAL a cada pedido, baseada no signo, elemento e contexto.",
      "A resposta deve ser em português brasileiro."
    ].join(" ");

    const user = [
      "Crie agora um horóscopo sincero para:",
      "SIGNO: " + signo,
      "ELEMENTO: " + elemento,
      contexto ? "CONTEXTO PESSOAL: " + contexto : "SEM CONTEXTO PESSOAL.",
      "",
      "Preencha exatamente estes seis campos: verdade, diario, semana, frase, exposicao e conselho.",
      "Cada campo deve ser diferente e específico.",
      "verdade: 2 ou 3 frases expondo um comportamento reconhecível do signo.",
      "diario: previsão divertida e específica para hoje.",
      "semana: 3 ou 4 frases formando uma previsão comportamental da semana.",
      "frase: uma frase curta, extremamente compartilhável e engraçada.",
      "exposicao: uma nova exposição curta, diferente da verdade.",
      "conselho: uma frase útil que ataque exatamente o ponto fraco do signo.",
      "Não escreva introdução fora desses campos."
    ].join("\n");

    const answer = await env.AI.run("@cf/zai-org/glm-4.7-flash", {
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_completion_tokens: 700,
      temperature: 0.9,
      response_format: { type: "json_object" }
    });

    const raw = typeof answer === "string" ? answer : (answer.response || "");
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = String(raw).match(/\{[\s\S]*\}/);
      if (!match) throw new Error("A IA não retornou um JSON válido.");
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
