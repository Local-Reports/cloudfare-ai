import { Ai } from './vendor/@cloudflare/ai.js';


const assistantPrompt = (json) => `\
All responses must be under 2000 characters. \
You cannot respond after this message. It is a one-off conversation. \
You are part of a larger organization to assist others. You do not work alone. \
You are a helpful assistant to individuals who have lost an item or person \
dear to them. Understand this report (in json) for information about the item: ${JSON.stringify(json)}. You received this information via word of mouth.\n\n\
Provide guidance to the individual to accquiring more information on their whereabouts \
while maintaining your strict professionalism. \
These individuals are capable of filling out a form provided with your service \
that provide additional information to you. \
Prompt individuals to provide more information if possible. 
`



export default {
  async fetch(request, env) {
    const tasks = [];
    const ai = new Ai(env.AI);

    

    if (request.method !== 'POST') {
      return Response.json({test: `invalid request type, received ${request.method}!`});
    }

	const cType = request.headers.get('content-type')
    if (cType !== 'application/json') {
      return Response.json({test: `invalid content-type, received ${cType}!`});
    }

    

    const test = await request.json();

    // extract the prompt.

    const question = test.question;
    const info = {...test}
    delete info.question;
    const prompt = assistantPrompt(info);


    // messages - chat style input
    let chat = {
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: question }
      ]
    };
    let response = await ai.run('@cf/meta/llama-2-7b-chat-int8', chat);
    tasks.push({ inputs: chat, response });

    return Response.json({test, env, tasks});
  }
};
