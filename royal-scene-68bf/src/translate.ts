import { Ai } from './vendor/@cloudflare/ai';



interface TranslationInfo {
    text: string;
    source_lang: string;
    target_lang: string;
}


export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
 
    if (request.method !== 'POST') {
      return Response.json({error: `invalid request type, received ${request.method}!`}, {status: 400});
    }

	const cType = request.headers.get('content-type')
    if (cType !== 'application/json') {
      return Response.json({error: `invalid content-type, received ${cType}!`}, {status: 400});
    }

    

    const information = await request.json<TranslationInfo>();

    // confirm all required fields are present
    if (!information.text || !information.source_lang || !information.target_lang) {
      return Response.json({error: `missing required fields!`}, {status: 400});
    }

    // extract the prompt.
    const ai = new Ai(env.AI);
 
    const response: {translated_text: string} = await ai.run('@cf/meta/m2m100-1.2b', information);

    // confirm the response is valid
    if (!response.translated_text) {
      return Response.json({error: `invalid response from AI!`});
    }

    return Response.json(response);
  }
};
