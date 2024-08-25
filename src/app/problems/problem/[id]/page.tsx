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
        </>)
    }
]

interface problemDetailType {

}

export default function Home({params} : Props) {
    const[loading, isLoading] = useState(false);
    const [problemDetail, setProblemDetail] = useState<problemDetailType>();

    useEffect(()=>{
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

    useEffect(()=>{
        console.log(problemDetail);
    }, [problemDetail])


    return (
        <div className='problemPage'>
            <Breadcrumb items={items} />
            <div>{params.id}홈</div>
        </div>
    )
}