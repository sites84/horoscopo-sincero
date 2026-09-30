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
Escreva em português brasileiro natural, com sarcasmo, intimidade, ironia e humor de observação. A graça vem de reconhecer comportamentos que quem é daquele signo vai pensar: "caralho, é verdade".
Nunca ataque aparência, saúde, transtornos, traumas ou características protegidas. Pode ESculachar hábitos, manias, contradições, orgulho, impulsividade, teimosia, indecisão, drama, necessidade de atenção, perfeccionismo, ciúme, preguiça, controle e outras características comportamentais comuns atribuídas ao signo.

IDENTIDADE OBRIGATÓRIA: o signo é EXATAMENTE ${signo} e o elemento é EXATAMENTE ${elemento}.
NUNCA troque o signo, mesmo que qualquer outro texto diga algo diferente. Tudo deve ser coerente com ${signo}.

CARACTERÍSTICAS DO SIGNO: use os traços tradicionalmente associados a ${signo} como matéria-prima para o humor. Não fique apenas dizendo que a pessoa é "intensa", "forte" ou "especial". Transforme a característica em uma situação cotidiana concreta e engraçada. A intenção é brincar COM a característica do signo, não fazer um horóscopo genérico.

Não escreva horóscopo genérico. Faça uma leitura específica para ${signo}, baseada em comportamentos cotidianos, hábitos, decisões, conversas, mensagens, trabalho, dinheiro e relações.
O perfil abaixo é uma âncora adicional. Use as ideias como referência, mas REESCREVA tudo e nunca copie as frases.
Perfil: ${JSON.stringify(perfil)}

Cada sessão precisa ter uma zoeira específica sobre características de ${signo}, mas sem repetir a mesma piada:
1. verdade = exponha uma característica típica de ${signo} e coloque isso numa situação cotidiana. Deve ter 2 frases e pelo menos uma alfinetada clara.
2. superpoder = pegue uma qualidade típica de ${signo}, elogie e imediatamente transforme o elogio em uma zoeira. Deve mostrar por que essa qualidade também pode ser irritante.
3. defeito = escolha uma característica problemática de ${signo} e ESculache sem ser cruel. Mostre como a pessoa usa uma desculpa elegante para justificar o próprio defeito.
4. semana = faça uma previsão comportamental concreta para os próximos dias, conectando pelo menos uma situação à característica típica de ${signo}. Não repita a verdade.
5. diario = previsão curta para hoje, com uma situação reconhecível que explore uma mania ou característica de ${signo}. Deve parecer feita para aquele signo, não para qualquer pessoa.
6. frase = uma única frase curta, memorável, debochada e muito compartilhável, resumindo uma característica de ${signo}.
7. exposicao = outra exposição curta e diferente, revelando uma segunda mania ou contradição típica de ${signo}.
8. conselho = conselho curto e prático, mas com uma última alfinetada ligada ao defeito de ${signo}.

Evite elogios vazios. Evite frases que poderiam servir para os 12 signos. Evite repetir palavras e piadas entre os campos. Não use títulos dentro dos campos. Não use emojis nos campos. Não explique as regras. Não diga que astrologia é ciência. Gere conteúdo novo a cada solicitação.`;

    const user = `Gere AGORA uma leitura nova e bem específica para ${signo}, elemento ${elemento}.
${contexto ? `Situação contada pelo visitante: ${contexto}` : "Não há situação pessoal. Não invente uma história específica sobre o visitante."}

A leitura deve parecer que Madame Verônica conhece exatamente as manias desse signo e resolveu parar de passar pano.

Limites para resposta rápida:
verdade: 2 frases.
superpoder: 2 frases.
defeito: 2 frases.
semana: 2 ou 3 frases.
diario: 2 frases.
frase: no máximo 16 palavras.
exposicao: 2 frases.
conselho: 1 ou 2 frases.

Retorne somente JSON válido com exatamente estes campos: verdade, superpoder, defeito, semana, diario, frase, exposicao, conselho.`;

    const modeloUsado = "@cf/meta/llama-3.1-8b-instruct-fp8";
    const answer = await env.AI.run(modeloUsado, {
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_tokens: 650,
      temperature: 0.86,
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
