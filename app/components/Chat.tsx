"use client";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ChatCompletionRequestMessage } from 'openai';
import React, { useEffect } from 'react'
import Form from 'react-bootstrap/esm/Form';

import ChatMessage from './ChatMessage';
import { generate, generateStream } from '@/utils/gpt';
import { useChatState } from '@/hooks/useChat';
import { TutorProps } from '@/app/tutor/page';
import { generateSuggestionsPromptForSystemPrompt, generateTeacherPrompt } from '@/constants/system-prompts';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';


function Chat({ grade, curriculum, subject, book, name, language }: TutorProps) {

    const [messages, setMessages] = React.useState<ChatCompletionRequestMessage[]>([])
    const [query, setQuery] = React.useState<string>('') 
    const [loading, setLoading] = React.useState<boolean>(false) 
    const [response, setResponse] = React.useState<string[]>([])
    const [suggestedSystemPrompts, setSuggestedSystemPrompts] = React.useState<string[]>(["Hi"])
    const [loadingSuggestions, setLoadingSuggestions] = React.useState<boolean>(false)

    const { 
        book: selectedBook, chapter, topic,
     } = useChatState((state) => ({
        book: state.book,
        chapter: state.chapter,
        topic: state.topic
     }))

    useEffect(() => {
        if (chapter && topic) {
            setMessages([{
                role: "system", 
                content: generateTeacherPrompt(grade, subject, book, topic, chapter, curriculum, name, language, language)
            }])
        }
    }, [selectedBook, chapter, topic])

    console.log(messages[0]?.content)

    function handleError<T>(err: T) {
        setLoading(false)
        setQuery('')
        console.error(err)
    }

    const convertMsgsToChatString = (message: ChatCompletionRequestMessage[]) => {
        let chatString = ""
        message.forEach((msg) => {
            chatString += msg.role === "user" ? `${msg.content}\n` : `Assistant: ${msg.content}\n`
        })
        // console.log({chatString})
        return chatString
    }

    const genSuggestionPrompts = (messageHistory: ChatCompletionRequestMessage[]) => {
        // if (loading) return
        // setLoading(true)

        setLoadingSuggestions(true)
        console.log(selectedBook, chapter, topic)
        if (!selectedBook || !chapter || !topic) return
        generate(
            [
                { role: "system", content: generateSuggestionsPromptForSystemPrompt(
                    curriculum, grade, subject, selectedBook, chapter, topic
                )},
                { role: "user", content: convertMsgsToChatString(messageHistory) },
            ],
            1
        ).then((res) => {
            try {
                const systemPrompts: string[] = res.split("\n")
                systemPrompts.filter((prompt) => prompt.length > 0)
                systemPrompts.forEach((prompt, index, arr) => {
                    arr[index] = prompt.trim()
                })
                setSuggestedSystemPrompts(systemPrompts)
                console.log(chapter, systemPrompts)
            } catch (err) {
                console.log(res, err)
            }
        }).catch((err) => {
            console.error(err)
        })
        .finally(() => {
            setLoadingSuggestions(false)
        })
    }

    // console.log(JSON.stringify(messages.slice(1)))

    const handleSubmit = async(query: string) => {
        setLoading(true)
        setSuggestedSystemPrompts([])
        const chatMessages: ChatCompletionRequestMessage[] = [ ...messages, { role: "user", content: query } ]
        setMessages(chatMessages)
        setQuery('')
        generateStream(chatMessages, handleError, (chunk) => {
            setResponse((res) => [ ...res, chunk ])
        }, 1)
    }

    useEffect(() => {
        if (response.length === 0) return
        if (response[response.length - 1] === "[DONE]") {
            setResponse([])
            const _messages: ChatCompletionRequestMessage[] = [...messages, { role: "assistant", content: response.slice(0, response.length - 1).join("") }]
            setMessages(_messages)
            genSuggestionPrompts(_messages.slice(1))
            setLoading(false)
        }
    }, [response])

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingBottom: "1rem",
            overflowX: "scroll",
        }} className="col-span-2">
            <Box sx={{
                overflowY: "scroll",
                height: "82.5vh",
            }}>
                {messages.slice(1).map((message, index) => (
                    <ChatMessage key={index} role={message.role} content={message.content} aiName="Tutor" />
                ))}
                {
                    loading && <ChatMessage role="assistant" content={response.join("")} aiName="Tutor" />
                }
            </Box>
            {
            (chapter && topic) && suggestedSystemPrompts.length > 0 && <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                sx={{
                    overflowX: "scroll",
                    height: "2.5vh",
                    marginTop: '1%',
                    marginBottom: '1%',
                    // position: "absolute",
                    // bottom: "60px",
                }}
            >   
                {   loadingSuggestions ? <div>Loading Suggestions ...</div> :
                    suggestedSystemPrompts.map((prompt, index) => (
                        <Container 
                        key={`prompt-${index}`}
                        sx={{
                            color: "grey",
                            border: "1px solid #e0e0 e0",
                            borderRadius: "20px",
                            marginLeft: "1%",
                            marginRight: "1%",
                            // maxHeight: "20px",
                            // overflowX: "scroll",
                            width: "fit-content",
                            whiteSpace: "nowrap",
                            // textAlign: "center",
                            
                        }}
                            onClick={() => handleSubmit(prompt)}
                        >
                            {prompt}
                        </Container>
                    ))
                }
                
            </Stack>
            }

            {
            (chapter && topic) && 
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "5vh",
                // position: "absolute",
                // bottom: "10px",
                // width: "50%"
            }}>
                <Form.Control 
                    type="input" 
                    placeholder="Start Chatting with your Tutor..."
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ marginLeft: "10%", width: "100%" }}
                />  
                <Button sx={{
                    color: "black",
                    border: 1,
                    marginLeft: "2.5%",
                    marginRight: "10%",
                }}
                    onClick={() => handleSubmit(query)}
                >
                    Send
                </Button>
            </Box>
            }
        </Box>
    )
}

export default Chat
