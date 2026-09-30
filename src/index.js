const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=UTF-8",
  "Cache-Control": "no-store"
};

function extrairTexto(answer) {
  if (typeof answer === "string") return answer;
  if (!answer || typeof answer !== "object") return "";
  const candidatos = [
    answer.response, answer.output_text, answer.content,
    answer.result?.response, answer.result?.output_text, answer.result?.content,
    answer.result?.choices?.[0]?.message?.content, answer.result?.choices?.[0]?.text,
    answer.choices?.[0]?.message?.content, answer.choices?.[0]?.text
  ];
  for (const valor of candidatos) if (typeof valor === "string" && valor.trim()) return valor;
  return "";
}

function respostaErro(status, error, detail = "") {
  return new Response(JSON.stringify({ error, detail }), { status, headers: corsHeaders });
}

async function gerarHoroscopo(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "POST") return respostaErro(405, "Método não permitido.");

  try {
    const body = await request.json();
    const signo = String(body.signo || "").trim();
    const elemento = String(body.elemento || "").trim();
    const contexto = String(body.contexto || "").trim().slice(0, 280);
    const perfil = body.perfil && typeof body.perfil === "object" ? body.perfil : {};

    if (!signo || !elemento) return respostaErro(400, "Signo e elemento são obrigatórios.");

    const system = `Você é Madame Verônica, personagem de um site brasileiro de horóscopo humorístico.
Escreva em português brasileiro natural, com sarcasmo leve, intimidade e humor de observação.
Nunca ataque aparência, saúde, transtornos, traumas ou características protegidas.

IDENTIDADE OBRIGATÓRIA: o signo é EXATAMENTE ${signo} e o elemento é EXATAMENTE ${elemento}.
NUNCA troque o signo, mesmo que qualquer outro texto diga algo diferente. Tudo deve ser coerente com ${signo}.

Não escreva horóscopo genérico. Faça uma leitura específica para ${signo}, baseada em comportamentos cotidianos, hábitos, decisões, conversas, mensagens, trabalho, dinheiro e relações.
O perfil abaixo é somente uma âncora de personalidade. Use as ideias como referência, mas REESCREVA tudo e nunca copie as frases.
Perfil: ${JSON.stringify(perfil)}

Cada sessão tem uma função diferente:
1. verdade = hábito reconhecível e engraçado de ${signo}.
2. superpoder = qualidade realista de ${signo}, transformada em humor; NÃO é poder sobrenatural.
3. defeito = comportamento que atrapalha ${signo}; diferente da verdade.
4. semana = previsão comportamental para os próximos dias, com situações concretas; não repetir a verdade.
5. diario = previsão curta e específica para hoje; não repetir a semana.
6. frase = uma única frase curta, memorável e muito compartilhável.
7. exposicao = segunda exposição curta, diferente de verdade e defeito.
8. conselho = conselho curto e prático relacionado ao defeito.

Não use títulos dentro dos campos. Não use emojis nos campos. Não explique as regras. Não diga que astrologia é ciência. Gere conteúdo novo a cada solicitação.`;

    const user = `Gere AGORA uma leitura nova para ${signo}, elemento ${elemento}.
${contexto ? `Situação contada pelo visitante: ${contexto}` : "Não há situação pessoal. Não invente uma história específica sobre o visitante."}

Limites para resposta rápida:
verdade: 2 frases.
superpoder: 1 ou 2 frases.
defeito: 2 frases.
semana: 2 ou 3 frases.
diario: 1 ou 2 frases.
frase: no máximo 16 palavras.
exposicao: 1 ou 2 frases.
conselho: 1 frase.

Retorne somente JSON válido com exatamente estes campos: verdade, superpoder, defeito, semana, diario, frase, exposicao, conselho.`;

    const modeloUsado = "@cf/meta/llama-3.1-8b-instruct-fp8";
    const answer = await env.AI.run(modeloUsado, {
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_tokens: 520,
      temperature: 0.82,
      top_p: 0.9,
      repetition_penalty: 1.08,
      response_format: { type: "json_object" }
    });

    const raw = extrairTexto(answer);
    if (!raw) throw new Error(`Workers AI respondeu sem texto utilizável. Modelo: ${modeloUsado}.`);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) throw new Error(`A IA retornou texto fora do JSON esperado.`);
      parsed = JSON.parse(match[0]);
    }

    const campos = ["verdade", "superpoder", "defeito", "semana", "diario", "frase", "exposicao", "conselho"];
    for (const campo of campos) {
      if (typeof parsed[campo] !== "string" || !parsed[campo].trim()) throw new Error(`Campo ausente: ${campo}.`);
    }

    return new Response(JSON.stringify({
      signo, elemento,
      verdade: parsed.verdade.trim(),
      superpoder: parsed.superpoder.trim(),
      defeito: parsed.defeito.trim(),
      semana: parsed.semana.trim(),
      diario: parsed.diario.trim(),
      frase: parsed.frase.trim(),
      exposicao: parsed.exposicao.trim(),
      conselho: parsed.conselho.trim()
    }), { status: 200, headers: corsHeaders });
  } catch (error) {
    return respostaErro(500, "Não foi possível gerar o horóscopo agora.", String(error?.message || error));
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/gerar-horoscopo") return gerarHoroscopo(request, env);
    return env.ASSETS.fetch(request);
  }
};
