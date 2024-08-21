"use client";

import Header from '@/app/components/Header';
import { ItemType } from '@/app/components/Breadcrumb';
import Breadcrumb from '@/app/components/Breadcrumb';
import { Form, Input, Button } from 'antd';
import React, {useState} from "react";
import type { FormProps } from 'antd';
import { resProp } from '../components/Alert';
import axios from "axios";
import Alert from '../components/Alert';
import { useDispatch, UseDispatch } from 'react-redux';
import { setToken } from '@/store/slices/authSlice'; 

const items: ItemType[] = [
    {
        href: '/login',
        title: (<>
            로그인
        </>)
    }
]

type FieldType = {
    id: string;
    password_1: string;
}

export default function Home() {
    const[loading, isLoading] = useState(false);
    const[response, setResponse] = useState<resProp>();

    const dispatch = useDispatch();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        isLoading(true);
        axios.post('/api/login', { ...values })
        // 로그인 성공
        .then(response => {
            isLoading(false);
            setResponse(response.data);
            console.log('응답 데이터', response.data);

            // JWT 토큰을 전역 상태로 저장
            const token = response.data.token;
            dispatch(setToken(token));
        })
        .catch(error => {
            isLoading(false);
            console.error('에러 발생:', error);
        });
      };
      
      const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <main>
            {
                !loading && response && response.type === 'success' ?
                    (
                        <Alert title={'🎉회원가입 성공!🎉'} type={'success'} message={response.message} modalOpen={true} url={'/'} />
                    )
                    : !loading && response && response.type === 'error' &&
                    (
                        <Alert title={'실패😭'} type={'error'} message={response.message} modalOpen={true} url={''} />
                    )
            }
            <Header />
            <Breadcrumb items={items} />
            
            <div className='container' style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
            <Form
                initialValues={{
                    id: "",
                    password_1: ""
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <div>아이디</div>
                <Form.Item<FieldType>
                    name="id"
                    rules={[{ required: true, message: '비어있습니다.' }]}
                >
                    <Input></Input>
                </Form.Item>

                <div>비밀번호</div>
                <Form.Item<FieldType>
                    name="password_1"
                    rules={[{ required: true, message: '비어있습니다.' }]}
                >
                    <Input.Password></Input.Password>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        로그인
                    </Button>
                </Form.Item>
            </Form>
          </div>
        </main>
    )
}