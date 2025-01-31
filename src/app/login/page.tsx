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
import { useDispatch, useSelector } from 'react-redux';
import { setId, setToken } from '@/store/slices/authSlice'; 
import { useRouter } from 'next/navigation';

import { RootState } from '@/store';

const items: ItemType[] = [
    {
        href: '/login',
        title: (<>
            Sign in
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
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);

    const router = useRouter();
    const dispatch = useDispatch();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        isLoading(true);
        axios.post('/api/login', { ...values })
        // 로그인 성공
        .then(response => {
            isLoading(false);
            setResponse(response.data);
            // console.log('응답 데이터', response.data);

            // JWT 토큰을 전역 상태로 저장
            const token = response.data.token;
            dispatch(setToken(token));

            // ID를 전역 상태로 저장
            const id = values.id;
            dispatch(setId(id));
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
                        <Alert title={'🎉WELCOME!🎉'} type={'success'} message={response.message} modalOpen={true} url={'/'} />
                    )
                    : !loading && response && response.type === 'error' &&
                    (
                        <Alert title={'Fail😭'} type={'error'} message={response.message} modalOpen={true} url={''} />
                    )
            }
            <Header isLogin={isLogin}/>
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
                <div style={{ width: "100%", height: "80px", backgroundColor: "#eee", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "5px", flexDirection: "column" }}>
                    <span>💡 To access [Problems] menu,</span>
                    <span>[Sign In] is required.</span>
                </div>                

                <div style={{ marginTop: "1.5rem" }}>ID</div>
                <Form.Item<FieldType>
                    name="id"
                    rules={[{ required: true, message: '비어있습니다.' }]}
                >
                    <Input></Input>
                </Form.Item>

                <div>Password</div>
                <Form.Item<FieldType>
                    name="password_1"
                    rules={[{ required: true, message: '비어있습니다.' }]}
                >
                    <Input.Password></Input.Password>
                </Form.Item>

                <Form.Item>
                    <Button loading={loading} style={{ width: "100%" }} type="primary" htmlType="submit">
                        Enter
                    </Button>
                </Form.Item>
                <p
                    // className="text-blue-600 hover:underline cursor-pointer"
                    style={{ color: "blue", cursor: "pointer", textAlign: "center", textDecoration: "underline" }}
                    onClick={() => router.push("/register")}
                    >
                    Don't have an account? Sign Up
                </p>
            </Form>
          </div>
        </main>
    )
}