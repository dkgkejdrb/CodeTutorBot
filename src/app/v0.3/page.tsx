"use client";

import Editor from "@monaco-editor/react";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Button, Tree } from 'antd';
import type { GetProps } from 'antd';
import { Input } from 'antd';
import { TreeLayout, TreeQuizData } from '../components/quizList';
import {
    review_roleSettingPrompt, reviewNecessityPredictionPrompt,
    reviewCommentGenerationPrompt_styleTone, reviewCommentGenerationPrompt_instruction,
    reviewCommentGenerationPrompt_restriction, reviewCommentGenerationPrompt_solution,
    reviewCommentGenerationPrompt_example
} from '../components/codeFeedbackModule';
const { TextArea } = Input;


type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;
const { DirectoryTree } = Tree;

export default function Home() {
    const editorRef = useRef<any>();

    // 에디터가 마운트되면 수행할 작업
    function hadleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor;
    }

    const [response, setResponse] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [extractedCode, setExtractedCode] = useState<string>();
    const [extractedComment, setExtractedComment] = useState<string>();
    useEffect(() => {
        if (response) {
            const startTag_result = "[RNP]";
            const endTag_result = "[/RNP]";
            const startIndex_result = response.indexOf(startTag_result) + startTag_result.length;
            const endIndex_result = response.indexOf(endTag_result);
            const result = response.substring(startIndex_result, endIndex_result).trim();
            if (result == "예") {
                const startTag_code = "[RC]";
                const endTag_code = "[/RC]";

                const startIndex_code = response.indexOf(startTag_code) + startTag_code.length;
                const endIndex_code = response.indexOf(endTag_code);
                const extractedCode = response.substring(startIndex_code, endIndex_code).trim();
                setExtractedCode(extractedCode);


                const startTag_comment = "[R]";
                const endTag_comment = "[/R]";

                const startIndex_comment = response.indexOf(startTag_comment) + startTag_comment.length;
                const endIndex_comment = response.indexOf(endTag_comment);
                setExtractedComment(response.substring(startIndex_comment, endIndex_comment).trim());
            }
        }
    }, [loading])


    const [quiz, setQuiz] = useState<string>();
    const [solution, setSolution] = useState<string>();
    const onSelect: DirectoryTreeProps['onSelect'] = (keys: any, info) => {
        setQuiz(TreeQuizData[keys[0]]);
        setSolution(reviewCommentGenerationPrompt_solution[keys[0]]);
    };

    return (
        <main>
            <div style={{ display: "flex" }}>
                <div className="left" style={{ width: 300 }}>
                    <DirectoryTree
                        multiple
                        defaultExpandAll
                        onSelect={onSelect}
                        treeData={TreeLayout()}
                    />
                </div>
                <div className="middle" style={{ width: 300 }}>
                    <TextArea value={quiz} rows={20} style={{ resize: 'none' }} />
                </div>
                <div className="right">
                    {
                        loading ?
                            <Button loading>실행</Button>
                            :
                            <Button
                                onClick={() => {
                                    setLoading(true);
                                    setExtractedCode(""); // 코멘트 영역 초기화
                                    axios.post('/api', {
                                        // 프로젝트 보고서 쓸 때, 아래 data 구조 참고
                                        data:
                                            review_roleSettingPrompt
                                            + reviewNecessityPredictionPrompt
                                            + reviewCommentGenerationPrompt_styleTone
                                            + reviewCommentGenerationPrompt_instruction
                                            + reviewCommentGenerationPrompt_restriction
                                            // + reviewCommentGenerationPrompt_exercise
                                            + "\n\n[파이썬 문제]\n" + quiz + "\n[/파이썬 문제]"
                                            + "\n\n[코드]\n" + editorRef.current.getValue() + "\n[/코드]" // reviewCommentGenerationPrompt_code
                                            + "\n\n[정답코드]" + solution + "\n[/정답코드]"
                                            // 프롬프트 예시 추가
                                            + reviewCommentGenerationPrompt_example
                                    })
                                        .then(response => {
                                            console.log('응답 데이터', response.data);
                                            setResponse(response.data.response.choices[0].message.content);
                                            setLoading(false);
                                        })
                                        .catch(error => {
                                            console.error('에러 발생:', error);
                                            setLoading(false);
                                        });
                                }}
                                style={{
                                    marginBottom: "16px"
                                }}
                            >실행</Button>
                    }
                    <Editor
                        width="800px"
                        height="200px"
                        language="python"
                        theme="vs-dark"
                        defaultValue="# 코드를 제출해주세요."
                        value={extractedCode}
                        onMount={hadleEditorDidMount}
                    />
                    <div
                        style={{
                            marginTop: "16px",
                            width: "800px"
                        }}>
                        {extractedComment}
                    </div>
                </div>
            </div>
        </main>
    );
}