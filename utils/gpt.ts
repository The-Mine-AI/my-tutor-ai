import { ChatCompletionRequestMessage } from "openai"
//@ts-ignore ts-nocheck
import { SSE } from 'sse.js'

export function generateStream<T = any>(
    messages: ChatCompletionRequestMessage[],
    onError: (err: T) => void,
    onMessage: (chunk: string) => void,
    temperature: number = 1
) {
    const eventSource = new SSE('/api/tutor', {
        headers: {
            'Content-Type': 'application/json',
        },
        payload: JSON.stringify({ messages, temperature, stream: true }),
    }) 
    
    eventSource.addEventListener('error', onError)
    eventSource.addEventListener('message', (event: MessageEvent) => {
        if (event.data === "[DONE]") { 
            onMessage("[DONE]")
            return
        }
        const completionResponse = JSON.parse(event.data) 
        const [{ delta }] = completionResponse.choices
        onMessage(delta.content)
    })
    eventSource.stream()
}

export async function generate(
    messages: ChatCompletionRequestMessage[],
    temperature: number = 1
) {
    const response = fetch('/api/tutor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, temperature }),
    }) 

    const completionResponse = await (await response).json()
    const [{ message }] = completionResponse.choices
    return message.content 
}