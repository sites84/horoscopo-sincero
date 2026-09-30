const CAMPOS = ["verdade", "superpoder", "defeito", "semana", "diario", "frase", "exposicao", "conselho"];
const MODELOS = [
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "@cf/meta/llama-3.1-8b-instruct",
  "@cf/zai-org/glm-4.7-flash"
];

function extrairTexto(answer) {
  if (typeof answer === "string") return answer;
  if (!answer || typeof answer !== "object") return "";
  const candidatos = [
    answer.response, answer.output_text, answer.content,
    answer.result?.response, answer.result?.output_text, answer.result?.content,
    answer.choices?.[0]?.message?.content, answer.result?.choices?.[0]?.message?.content,
    answer.choices?.[0]?.text, answer.result?.choices?.[0]?.text
  ];
  for (const valor of candidatos) {
    if (typeof valor === "string" && valor.trim()) return valor;
  }
  return "";
}

function limparResposta(raw) {
  return String(raw || "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

function extrairObjeto(raw) {
  const texto = limparResposta(raw);
  try { return JSON.parse(texto); } catch (_) {}

  const inicio = texto.indexOf("{");
  const fim = texto.lastIndexOf("}");
  if (inicio >= 0 && fim > inicio) {
    try { return JSON.parse(texto.slice(inicio, fim + 1)); } catch (_) {}
  }

  const parcial = {};
  for (const campo of CAMPOS) {
    const re = new RegExp(`"${campo}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, "i");
    const m = texto.match(re);
    if (m) {
      try { parcial[campo] = JSON.parse(`"${m[1]}"`); }
      catch (_) { parcial[campo] = m[1].replace(/\\"/g, '"').replace(/\\n/g, " "); }
    }
  }
  return parcial;
}

function validar(dados) {
  return !!dados && typeof dados === "object" &&
    CAMPOS.every(c => typeof dados[c] === "string" && dados[c].trim().length > 0);
}

function montarPrompt(signo, elemento, contexto, perfil) {
  return `Você é Madame Verônica, brasileira, 40 e poucos. Fala como gente. Irônica, íntima, ácida e adulta. Frases naturais e curtas. Você lê o signo como quem já pegou a pessoa em flagrante.

SIGNO EXATO: ${signo}. ELEMENTO EXATO: ${elemento}. Nunca troque o signo.

OBJETIVO: a pessoa de ${signo} precisa pensar "pior que eu faço isso mesmo". Não faça horóscopo de revista e não seja genérica.

HUMOR: cena cotidiana brasileira + traço típico de ${signo} + alfinetada curta no MESMO ponto. Use situações como mensagem, áudio, boleto, reunião, visto sem resposta, restaurante de sempre, plano que nunca começa. Não explique a piada. Não faça stand-up. Não invente biografia.

PERFIL DO SIGNO: ${JSON.stringify(perfil)}
O perfil é somente uma âncora. Invente cenas novas. Nunca copie frases do perfil.

REGRAS DOS CAMPOS:
- verdade: hábito típico e reconhecível. 3 ou 4 frases.
- superpoder: qualidade real de ${signo} usada em excesso. 3 frases.
- defeito: comportamento que atrapalha. Diferente de verdade. 3 ou 4 frases.
- semana: comportamento provável nos próximos dias, com situações concretas. 3 ou 4 frases.
- diario: somente hoje. Diferente da semana. 3 frases.
- frase: uma única linha memorável e compartilhável. Máximo 16 palavras.
- exposicao: terceira mania, diferente de verdade e defeito. 3 frases.
- conselho: conselho prático ligado ao defeito. 2 frases.

Nas sessões longas: as 2 primeiras frases entregam a leitura clara. A última ou as últimas frases fazem a zoeira. Não abra uma história nova para fazer a piada.

IMPORTANTE: não encurte os campos longos para uma frase. Cada campo longo precisa cumprir a quantidade de frases acima. Seja conciso dentro dessas frases, mas não omita conteúdo.

PROIBIDO usar: "como um verdadeiro", "seu jeitinho", "no fundo você", "tipo de pessoa que", "caos organizado", "energia", "vibra", "universo", "as estrelas", metáfora de animal ou elemento, emoji, meme, inglês barato, ponto de exclamação ou elogio disfarçado. Nunca ataque corpo, doença, trauma, transtorno ou característica protegida.

EXEMPLO DE TOM:
RUIM: "Você, como todo Escorpião, sente com intensidade e testa as pessoas."
BOM: "Você pergunta se está tudo bem já sabendo que não está. Se a pessoa disser que está, não acredita. Se confessar, guarda a frase."

Contexto do visitante: ${contexto || "sem contexto pessoal; não invente biografia"}

RETORNE SOMENTE JSON VÁLIDO. Exatamente estes oito campos: ${CAMPOS.join(", ")}. Todos devem estar preenchidos em português brasileiro. Não escreva nada antes ou depois do JSON.`;
}

async function chamarModelo(env, modelo, messages, modoJson = true) {
  const opcoes = {
    messages,
    max_tokens: 1600,
    temperature: 0.82,
    top_p: 0.9,
    repetition_penalty: 1.08
  };
  if (modoJson) opcoes.response_format = { type: "json_object" };
  return env.AI.run(modelo, opcoes);
}

export async function gerarConteudo(env, { signo, elemento, contexto, perfil }) {
  const messages = [
    {
      role: "system",
      content: `Você é Madame Verônica. Gere somente JSON válido em português brasileiro. O signo solicitado é EXATAMENTE ${signo}. Nunca troque o signo. Nunca omita nenhum dos oito campos.`
    },
    { role: "user", content: montarPrompt(signo, elemento, contexto, perfil) }
  ];

  let ultimoErro = "";

  for (const modelo of MODELOS) {
    // Primeiro tenta JSON Mode. Se o modelo rejeitar esse formato, tenta novamente sem ele.
    for (const modoJson of [true, false]) {
      try {
        const answer = await chamarModelo(env, modelo, messages, modoJson);
        const raw = extrairTexto(answer);
        const parsed = extrairObjeto(raw);
        if (validar(parsed)) {
          return Object.fromEntries(CAMPOS.map(c => [c, parsed[c].trim()]));
        }
        ultimoErro = `${modelo}: resposta incompleta ou JSON inválido`;
      } catch (error) {
        ultimoErro = `${modelo}: ${String(error?.message || error)}`;
      }
    }
  }

  throw new Error(`Nenhum modelo retornou os 8 campos. ${ultimoErro}`);
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=UTF-8",
    "Cache-Control": "no-store"
  };
}

export async function handleGenerate(request, env) {
  const cors = corsHeaders();
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405, headers: cors });
  }

  try {
    const body = await request.json();
    const signo = String(body.signo || "").trim();
    const elemento = String(body.elemento || "").trim();
    const contexto = String(body.contexto || "").trim().slice(0, 280);
    const perfil = body.perfil && typeof body.perfil === "object" ? body.perfil : {};

    if (!signo || !elemento) {
      return new Response(JSON.stringify({ error: "Signo e elemento são obrigatórios." }), { status: 400, headers: cors });
    }

    const dados = await gerarConteudo(env, { signo, elemento, contexto, perfil });
    return new Response(JSON.stringify({ signo, elemento, ...dados }), { status: 200, headers: cors });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Não foi possível gerar o horóscopo agora.",
      detail: String(error?.message || error)
    }), { status: 500, headers: cors });
  }
}
