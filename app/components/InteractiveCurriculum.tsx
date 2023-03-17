"use client"

import { BooksPrompt, ChaptersPromptFromBook, ChaptersPromptNoBook, TopicsPromptFromBook, TopicsPromptNoBook } from '@/constants/system-prompts'
import { generate } from '@/utils/gpt'
import { InputLabel, Select, MenuItem, FormControl, Box } from '@mui/material'
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import React from 'react'
import { useChatState } from '@/hooks/useChat';
import { TutorContextProps } from '@/app/tutor/page';


function InteractiveCurriculum({ grade, curriculum, subject, book }: TutorContextProps) {

    const [books, setBooks] = React.useState<string[]>([])
    const [chapters, setChapters] = React.useState<string[]>([])
    const [syllabus, setSyllabus] = React.useState<Record<string, string[]>>({})
    const [loading, setLoading] = React.useState<boolean>(false)
    
    const { 
        book: selectedBook, chapter, topic,
        setBook, setChapter, setTopic,
     } = useChatState()


    const genTopics = (chapter: string) => {
        // if (loading) return
        // setLoading(true)
        generate(
            [
                { role: "system", content: selectedBook ? TopicsPromptFromBook : TopicsPromptNoBook},
                { role: "user", content: selectedBook ? 
                    `Generate the topics from the book ${selectedBook} of ${grade} to teach a student ${subject} ${curriculum ? "of the " + curriculum + " curriculum" : ""} from the chapter ${chapter}` 
                    : 
                    `Generate the topics to teach a student of ${grade} studying ${subject} ${curriculum ? "of the " + curriculum + " curriculum" : ""} from the chapter ${chapter}`
                },
            ],
            0
        ).then((res) => {
            try {
                const topics = res.split("\n")
                setSyllabus((syllabus) => ({ ...syllabus, [chapter]: topics }))
                console.log(chapter, topics)
            } catch (err) {
                console.log(res, err)
            }
        }).catch((err) => {
            console.error(err)
        })
        // .finally(() => {
        //     setLoading(false)
        // })
    }

    const genBooks = () => {
        if (loading) return
        setLoading(true)
        generate(
            [
                { role: "system", content: BooksPrompt},
                { role: "user", content: `Generate the books that are used to teach a student of ${grade} studying ${subject} ${curriculum ? "of the " + curriculum + " curriculum" : ""}` },
            ],
            0
        ).then((res) => {
            try {
                const books = res.split("\n")
                setBooks(books)
                setBook(books[0])
                console.log(books)
            } catch (err) {
                console.log(res, err)
            }
        }).catch((err) => {
            console.error(err)
        }).finally(() => {
            setLoading(false)
        })
    }

    const genChapters = () => {
        if (loading) return
        setLoading(true)
        generate(
            [
                { role: "system", content: selectedBook ? ChaptersPromptFromBook : ChaptersPromptNoBook},
                { role: "user", content:  selectedBook ?  
                    `Generate the chapters from the book ${selectedBook} of ${grade} to teach a student ${subject} ${curriculum ? "of the " + curriculum + " curriculum" : ""}` 
                    :
                    `Generate the chapters to teach a student of ${grade} studying ${subject} ${curriculum ? "of the " + curriculum + " curriculum" : ""}`
                },
            ],
            0
        ).then((res) => {
            try {
                const _chapters: string[] = res.split("\n")
                setChapters(_chapters)
                Promise.allSettled(_chapters.map((chapter) => genTopics(chapter))).finally(() => {
                    setLoading(false)
                })
                console.log(_chapters)
            } catch (err) {
                console.log(res, err)
            } 
        }).catch((err) => {
            console.error(err)
        })
    }

    if (loading) return <div>Loading...</div>

    return (
        <Box sx={{
            height: "100vh",
            overflowY: "scroll"
        }}>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="select-book">Book</InputLabel>
            <Select
                labelId="select-book"
                id="select-book"
                value={selectedBook}
                label="Book"
                onChange={event => setBook(event.target.value as string)}
            >
                {books.map((book, i) => (
                    <MenuItem key={i} value={book}>{book}</MenuItem>
                ))}
                {/* <MenuItem value="Our Pasts - III">Our Pasts - III</MenuItem> */}
                {/* <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}
            </Select>
            <button onClick={genBooks} disabled={loading}>Load</button>
            <button onClick={genChapters} disabled={loading}>Generate</button>
      </FormControl>
        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ height: "100vh", flexGrow: 1, maxWidth: 400, overflowY: 'scroll' }}
            >
                {
                    chapters.length === Object.keys(syllabus).length && chapters.map((chapter, i) => (
                        <TreeItem 
                            key={`${i}-${chapter}`} 
                            nodeId={`${i}-${chapter}`} 
                            label={chapter}
                        >
                            {
                                syllabus[chapter]?.map((topic, i) => (
                                    <TreeItem key={`${i}-${topic}`} nodeId={`${i}-${topic}`} label={topic} onClick={() => {
                                        setChapter(chapter)
                                        setTopic(topic)
                                    }} />
                                ))
                            }
                        </TreeItem>
                    ))
                }
        </TreeView>
    </Box>
    )
}

export default InteractiveCurriculum
