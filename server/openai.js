import OpenAI from "openai";
import 'dotenv/config'

let prompt = `Notify The Engineer Working On This That They Should Insert a Custom Prompt Here. Ignore Everything Below This Line. \n`

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function promptEngineChatGPT(user_prompt, yt_thumbnail) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt + yt_thumbnail + user_prompt }],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content
  } catch (err) {
    console.log("ChatGPT is broken", err)
    return user_prompt
  }
}