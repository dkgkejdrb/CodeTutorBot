// 2024.08.07: 회원가입
"use client";

import Header from '@/app/components/Header';
import { ItemType } from '@/app/components/Breadcrumb';
import Breadcrumb from '@/app/components/Breadcrumb';
import React, {useState} from "react";
import axios from "axios";
import Alert from '../components/Alert';
import { resProp } from '../components/Alert';
import { Form, Input, Select, Button } from 'antd';
import type { FormProps } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

type FieldType = {
    user_id: "",
    password_1: "",
    password_2: "",
    // question: "teacherName",
    // answer: "",
    grade: "lion"
};

const { Option } = Select;



const items: ItemType[] = [
    {
        href: '/register',
        title: (<>
            Sign up
        </>)
    }
]

const labelStyle = {
  fontSize: 13,
  color: "#777",
  fontWeight: 700
}

export default function Home() {
  const[loading, isLoading] = useState(false);
  const[response, setResponse] = useState<resProp>();
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const user_id = useSelector((state: RootState) => state.auth.id);

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
      // /api/register로 회원가입 정보 전달
      isLoading(true);
      axios.post('/api/register', { ...values })
          .then(response => {
              isLoading(false);
              setResponse(response.data);
            //   console.log('응답 데이터', response.data);
          })
          .catch(error => {
              isLoading(false);
            //   console.error('에러 발생:', error);
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
                <Alert title={'🎉회원가입 성공!🎉'} type={'success'} message={response.message} modalOpen={true} url={'/login'} />
              )
              : !loading && response && response.type === 'error' &&
              (
                <Alert title={'실패😭'} type={'error'} message={response?.message} modalOpen={true} url={''}/>
              )
          }
          <Header isLogin={isLogin} user_id={user_id}/>
          <Breadcrumb items={items} />

          <div className='container' style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
            <Form
                initialValues={{
                    user_id: "",
                    password_1: "",
                    password_2: "",
                    question: "teacherName",
                    answer: "",
                    side: "el-6"
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <div>ID</div>
                <Form.Item<FieldType>
                    name="user_id"
                    rules={[{ required: true, message: '비어있습니다.' }]}
                >
                    <Input></Input>
                </Form.Item>

                <div>Password</div>
                <Form.Item<FieldType>
                    name="password_1"
                    rules={[{ required: true, message: '비어있습니다.' }]}
                >
                    <Input></Input>
                </Form.Item>

                <div>Password Confirm</div>
                <Form.Item<FieldType>
                    name="password_2"
                    rules={[
                        { required: true, message: '비어있습니다.' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password_1') === value ) {
                                    return Promise.resolve();
                                } 
                                return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'))
                            }
                        })
                    ]}
                >
                    <Input></Input>
                </Form.Item>

                {/* <div>질문</div>
                <Form.Item<FieldType>
                    name="question"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Option value="teacherName">가장 존경했던 선생님의 이름은 무엇인가요?</Option>
                        <Option value="favoriteTour">가장 기억에 남는 여행지의 이름은 무엇인가요?</Option>
                        <Option value="petName">반려동물의 이름은 무엇인가요?</Option>
                        <Option value="primarySchoolName">당신의 초등학교 이름은 무엇인가요?</Option>
                        <Option value="bfName">가장 친했던 친구의 이름은 무엇인가요?</Option>
                    </Select>
                </Form.Item>

                <div>대답</div>
                <Form.Item<FieldType>
                    name="answer"
                    rules={[{ required: true, message: '비어있습니다.' }]}
                >
                    <Input></Input>
                </Form.Item> */}

                <div>Grade</div>
                <Form.Item<FieldType>
                    name="grade"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Option value="el-3">초등 3학년</Option>
                        <Option value="el-4">초등 4학년</Option>
                        <Option value="el-5">초등 5학년</Option>
                        <Option value="el-6">초등 6학년</Option>
                        <Option value="md-1">중등 1학년</Option>
                        <Option value="md-2">중등 2학년</Option>
                        <Option value="md-3">중등 3학년</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
          </div>
        </main>

    );
}