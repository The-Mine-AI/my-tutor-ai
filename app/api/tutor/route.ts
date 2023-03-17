import { getNumTokens } from "@/utils/tokenizer";
import { ChatCompletionRequestMessage, CreateChatCompletionRequest } from "openai";

 export async function POST (request: Request) {

    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 })

    const OPENAI_KEY = process.env.OPENAI_KEY

    try {
        const requestData = await request.json();
        if (!requestData) throw new Error("No request data");

        const reqMessages: ChatCompletionRequestMessage[] = requestData.messages;
        if (!reqMessages) throw new Error("No messages");

        let tokenCount = 0
        reqMessages.forEach((message) => {
            tokenCount += getNumTokens(message.content)
        })

        const moderationRes = await fetch("https://api.openai.com/v1/moderations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                Authorization: `Bearer ${OPENAI_KEY}`
            },
            body: JSON.stringify({
                input: reqMessages[reqMessages.length - 1].content
            })
        })
        const moderationData = await moderationRes.json()
        const [ results ] = moderationData.results
        if (results.flagged) { throw new Error("Query message flagged") }

        
        
        const systemPromptMsg = reqMessages[0]
        const systemPrompt = systemPromptMsg.content
        tokenCount += getNumTokens(systemPrompt)

        let usableMessages = [...reqMessages.slice(1)]
        while (tokenCount > 4000) {
            if (usableMessages.length > 1) {
                const message = usableMessages.shift()
                if (message) tokenCount -= getNumTokens(message.content)
            } else {
                throw new Error("Message too long")
            }
        }

        usableMessages = [
            systemPromptMsg,
            ...usableMessages
        ]

        // const messages: ChatCompletionRequestMessage[] = [
        //     // { role: 'system', content: systemPrompt },
        //     ...usableMessages
        // ]

        // console.debug("messages", reqMessages)

        const chatCompletionRequestOpts: CreateChatCompletionRequest = {
            model: 'gpt-3.5-turbo',
            messages: usableMessages,
            temperature: requestData.temperature ?? 1,
            stream: requestData.stream ?? false,
            max_tokens: 2048,
            // top_p: 0,
            // frequency_penalty: 0,
            // presence_penalty: 0,
        }
        console.debug("chatCompletionRequestOpts", chatCompletionRequestOpts, JSON.stringify(chatCompletionRequestOpts))
    
        const chatCompletionRes = await fetch("https://api.openai.com/v1/chat/completions", { 
            method: "POST",   
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_KEY}`
            },
            body: JSON.stringify(chatCompletionRequestOpts) 
        })

        if (!chatCompletionRes.ok) {
            const err = await chatCompletionRes.json()
            console.error(err)
            throw new Error(err)
        }  

        if (requestData.stream) {
            return new Response(chatCompletionRes.body, {
                headers: {
                    "Content-Type": "text/event-stream" 
                }
            })
        } else {
            const data = await chatCompletionRes.json()
            console.log(data)
            return new Response(JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json" 
                }
            })
        }
    } catch (err) {
        console.error(err)
        return new Response(JSON.stringify({ error: "there was an error processing your request " }), { status: 500 })
    } 

 }