'use client'

import './page.css';
import Breadcrumb from './Breadcrumb';
import { ItemType } from '@/app/components/Breadcrumb';
import { useEffect, useState } from 'react';
import axios from "axios";

type Props = {
    params: {
        id: string;
    }
}

const items: ItemType[] = [
    {
        href: '/',
        title: (<>
            홈
        </>)
    },
    {
        href: '/problems',
        title: (<>
            전체 문제
        </>),
    }
]

interface problemDetailType {
    description: string;
    difficulty: string;
    hint: string;
    input_output_ex: string;
    problem_id: string;
    restriction: string;
    title?: string;
    type: string;
    _id: string;
}

export default function Home({ params }: Props) {
    const [loading, isLoading] = useState(false);
    const [problemDetail, setProblemDetail] = useState<problemDetailType>();
    const [breadcrumbItems, setBreadcrumbItems] = useState<ItemType[]>([{
        href: '/',
        title: (<>
            홈
        </>)
    }])

    useEffect(() => {
        isLoading(true);
        axios.post('/api/problemDetail', { _id: params.id })
            // 로그인 성공
            .then(response => {
                // console.log(response.data);
                isLoading(false);

                setProblemDetail(response.data);
                // console.log('응답 데이터', response.data);
            })
            .catch(error => {
                isLoading(false);
                // console.error('에러 발생:', error);
            });
    }, [])

    useEffect(() => {
        console.log(problemDetail);
    }, [problemDetail])


    return (
        <div className='problemPage'>
            {
                !loading && problemDetail ?
                    <div className='_problemPage'>
                        <Breadcrumb items={items} afterItem={problemDetail.title} />
                        <div className='container'>
                            <div className='_container' style={{ display: "flex", minHeight: "calc(100vh - 3.125rem - 24.625rem - 5rem)" }}>
                                {/* {params.id} */}
                                <div className='left' style={{ width: "calc(40% - 12px)", padding: "12px 12px 0px 0px", borderRight: "solid 2px #eee" }}>
                                    {
                                        problemDetail.description &&
                                        <div className='__container'>
                                            <div className='title'>문제 설명</div>
                                            <p>
                                                {problemDetail.description}
                                            </p>
                                        </div>
                                    }
                                    {
                                        problemDetail.restriction &&
                                        <div className='__container' style={{ marginTop: 16 }}>
                                            <div className='title'>제한 사항</div>
                                            <p>
                                                {problemDetail.restriction}
                                            </p>
                                        </div>
                                    }
                                                                        {
                                        problemDetail.input_output_ex &&
                                        <div className='__container' style={{ marginTop: 16 }}>
                                            <div className='title'>입출력 예</div>
                                            <div dangerouslySetInnerHTML={{__html: problemDetail.input_output_ex}} style={{ margin: "16px 0px" }}></div>
                                        </div>
                                    }
                                    {
                                        problemDetail.hint &&
                                        <div className='__container' style={{ marginTop: 16 }}>
                                            <div className='title'>힌트</div>
                                            <p>
                                                {problemDetail.hint}
                                            </p>
                                        </div>                                        
                                    }
                                </div>
                                <div className='right' style={{ width: "60%" }}>
                                    right
                                </div>
                            </div>
                        </div>
                        <div className='bottom' style={{ height: 58, borderTop: "solid 2px #eee" }}></div>
                    </div>
                    :
                    <></>
            }

        </div>
    )
}