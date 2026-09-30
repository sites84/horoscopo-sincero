const CAMPOS = ["verdade", "superpoder", "defeito", "semana", "diario", "frase", "exposicao", "conselho"];
const MODELOS = ["@cf/meta/llama-3.3-70b-instruct-fp8-fast", "@cf/meta/llama-3.1-8b-instruct", "@cf/zai-org/glm-4.7-flash"];
const schema = { type: "json_schema", json_schema: { type: "object", properties: Object.fromEntries(CAMPOS.map(c => [c, { type: "string" }])), required: CAMPOS, additionalProperties: false } };

function extrairTexto(answer) {
  if (typeof answer === "string") return answer;
  if (!answer || typeof answer !== "object") return "";
  const candidatos = [answer.response, answer.output_text, answer.content, answer.result?.response, answer.result?.output_text, answer.result?.content, answer.choices?.[0]?.message?.content, answer.result?.choices?.[0]?.message?.content, answer.choices?.[0]?.text, answer.result?.choices?.[0]?.text];
  for (const valor of candidatos) if (typeof valor === "string" && valor.trim()) return valor;
  return "";
}

function limparResposta(raw) {
  return String(raw || "").replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
}

function extrairObjeto(raw) {
  const texto = limparResposta(raw);
  try { return JSON.parse(texto); } catch (_) {}
  const inicio = texto.indexOf("{");
  const fim = texto.lastIndexOf("}");
  if (inicio >= 0 && fim > inicio) { try { return JSON.parse(texto.slice(inicio, fim + 1)); } catch (_) {} }
  const parcial = {};
  for (const campo of CAMPOS) {
    const re = new RegExp(`"${campo}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, "i");
    const m = texto.match(re);
    if (m) {
      try { parcial[campo] = JSON.parse(`"${m[1]}"`); } catch (_) { parcial[campo] = m[1].replace(/\\"/g, '"').replace(/\\n/g, " "); }
    }
  }
  return parcial;
}

function validar(dados) { return !!dados && typeof dados === "object" && CAMPOS.every(c => typeof dados[c] === "string" && dados[c].trim().length > 0); }

function montarPrompt(signo, elemento, contexto, perfil) {
  return `Você é Madame Verônica, brasileira, 40 e poucos. Fala como gente, com ironia íntima, humor ácido adulto e frases curtas. Você lê a pessoa como quem já pegou a criatura em flagrante.

SIGNO EXATO: ${signo}. ELEMENTO EXATO: ${elemento}. Nunca troque o signo.

Objetivo: a pessoa precisa pensar "pior que eu faço isso mesmo". Use cenas brasileiras concretas: mensagem, áudio, boleto, reunião, visto sem resposta, restaurante de sempre, plano que não começa. Mecanismo: cena cotidiana + traço típico do signo + alfinetada curta no mesmo ponto.

O perfil é âncora, não texto. Invente cenas novas e nunca copie frases do perfil:
${JSON.stringify(perfil)}

Não seja genérica. Não transforme tudo em elogio. Não explique a piada. Cada campo deve ter ângulo diferente. Não use "como um verdadeiro", "seu jeitinho", "no fundo você", "tipo de pessoa que", "caos organizado", "energia", "vibra", "universo", "as estrelas", metáfora de animal ou elemento, emoji, meme, inglês barato ou ponto de exclamação. Nunca ataque corpo, doença, trauma, transtorno ou característica protegida.

Campos:
verdade = hábito típico e reconhecível, 3-4 frases.
superpoder = qualidade real usada em excesso, 2-3 frases.
defeito = comportamento que atrapalha, diferente de verdade, 3-4 frases.
semana = conduta provável nos próximos dias, concreta, 3-4 frases.
diario = somente hoje, diferente da semana, 2-3 frases.
frase = uma linha memorável e compartilhável, até 16 palavras.
exposicao = terceira mania, diferente de verdade e defeito, 2-3 frases.
conselho = prático e ligado ao defeito, 1-2 frases.

Nas sessões longas, as 2 primeiras frases são a leitura clara; as últimas 1-2 são a zoeira curta. Se não houver uma boa alfinetada, fique seco. Não escreva títulos dentro dos campos.

Contexto do visitante: ${contexto || "sem contexto pessoal; não invente biografia"}

Retorne SOMENTE um objeto JSON com exatamente estes oito campos: ${CAMPOS.join(", ")}. Cada campo deve estar preenchido em português brasileiro. Não coloque texto antes ou depois do JSON.`;
}

async function chamarModelo(env, modelo, messages, usarSchema = true) {
  const opcoes = { messages, max_tokens: 1200, temperature: 0.82, top_p: 0.9, repetition_penalty: 1.08 };
  if (usarSchema && modelo !== "@cf/zai-org/glm-4.7-flash") opcoes.response_format = schema;
  return env.AI.run(modelo, opcoes);
}

export async function gerarConteudo(env, { signo, elemento, contexto, perfil }) {
  const messages = [
    { role: "system", content: "Você gera somente JSON válido. Nunca troque o signo solicitado. Nunca omita nenhum dos oito campos." },
    { role: "user", content: montarPrompt(signo, elemento, contexto, perfil) }
  ];
  let ultimoErro = "";
  for (const modelo of MODELOS) {
    const tentativas = modelo === "@cf/zai-org/glm-4.7-flash" ? [false] : [true, false];
    for (const usarSchema of tentativas) {
      try {
        const answer = await chamarModelo(env, modelo, messages, usarSchema);
        const parsed = extrairObjeto(extrairTexto(answer));
        if (validar(parsed)) return Object.fromEntries(CAMPOS.map(c => [c, parsed[c].trim()]));
        ultimoErro = `${modelo}: resposta incompleta ou JSON inválido`;
      } catch (error) { ultimoErro = `${modelo}: ${String(error?.message || error)}`; }
    }
  }
  throw new Error(`Nenhum modelo retornou os 8 campos. ${ultimoErro}`);
}

export function corsHeaders() {
  return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json; charset=UTF-8", "Cache-Control": "no-store" };
}

export async function handleGenerate(request, env) {
  const cors = corsHeaders();
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405, headers: cors });
  try {
    const body = await request.json();
    const signo = String(body.signo || "").trim();
    const elemento = String(body.elemento || "").trim();
    const contexto = String(body.contexto || "").trim().slice(0, 280);
    const perfil = body.perfil && typeof body.perfil === "object" ? body.perfil : {};
    if (!signo || !elemento) return new Response(JSON.stringify({ error: "Signo e elemento são obrigatórios." }), { status: 400, headers: cors });
    const dados = await gerarConteudo(env, { signo, elemento, contexto, perfil });
    return new Response(JSON.stringify({ signo, elemento, ...dados }), { status: 200, headers: cors });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Não foi possível gerar o horóscopo agora.", detail: String(error?.message || error) }), { status: 500, headers: cors });
  }
}
