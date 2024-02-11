import { Ai } from './vendor/@cloudflare/ai.js';


interface Prompt {
  prompt: string;
}

async function handlePost(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

  // ensure request type

  if (request.method !== 'POST') {
    return Response.json({ error: `invalid request type, received ${request.method}!` }, { status: 400 });
  }

  // ensure content type

  const cType = request.headers.get('content-type');

  if (cType !== 'application/json') {
    return Response.json({ error: `invalid content-type, received ${cType}!` }, { status: 400 });
  }


  const inputs = await request.json<Prompt>();

  // ensure the inputs are valid

  if (!inputs.prompt) {
    return Response.json({ error: `missing required fields!` }, { status: 400 });
  }

  const ai = new Ai(env.AI);

  const response = await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', inputs);

  // assume response is valid since raw bytes.
  return new Response(response, {
    headers: {
      'content-type': 'image/png',
    },
  });
}

async function handleGet(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  
  if (request.method !== 'GET') {
    return Response.json({ error: `invalid request type, received ${request.method}!` }, { status: 400 });
  }

  const params = new URL(request.url).searchParams;

  const prompt = params.get('prompt');

  if (prompt == null) {
    return Response.json({ error: `missing required fields!` }, { status: 400 });
  }

  const cleanPrompt = decodeURIComponent(prompt);

  const ai = new Ai(env.AI);

  const response = await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', { prompt: cleanPrompt });

  // assume response is valid since raw bytes.

  return new Response(response, {
    headers: {
      'content-type': 'image/png',
    },
  });

}


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {


    switch (request.method) {
      case 'POST':
        return handlePost(request, env, ctx);
      case 'GET':
        return handleGet(request, env, ctx);
      default:
        return Response.json({ error: `invalid request type, received ${request.method}!` }, { status: 400 });

    }
  }
};
