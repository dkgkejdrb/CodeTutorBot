// 2024.08.07: 회원가입
"use client";

import Header from '@/app/components/Header';
import { ItemType } from '@/app/components/Breadcrumb';
import Breadcrumb from '@/app/components/Breadcrumb';
import React, {useState} from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  VStack,
  ChakraProvider,
} from "@chakra-ui/react";
import Alert from '../components/Alert';
import { resProp } from '../components/Alert';

const items: ItemType[] = [
    {
        href: '/register',
        title: (<>
            회원가입
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

  const formik = useFormik({
    initialValues: {
      id: "",
      password_1: "",
      password_2: "",
      question: "teacherName",
      answer: "",
      side: "lion"
    },
    // Step 4 > e-1
    onSubmit: (values) => {
      // /api/register로 회원가입 정보 전달
      isLoading(true);
      axios.post('/api/register', {...values})
        .then(response => {
          isLoading(false);
          setResponse(response.data);
          console.log('응답 데이터', response.data);
        })
        .catch(error => {
          isLoading(false);
          console.error('에러 발생:', error);
        });
    },
    validationSchema: Yup.object({
      id: Yup.string().max(15, "15 글자를 넘을 수 없어요.").required("비어있어요."),
      password_1: Yup.string().max(15, "20 글자를 넘을 수 없어요.").required("비어있어요."),
      password_2: Yup.string().oneOf([Yup.ref('password_1')], '비밀번호가 일치하지 않아요.').nullable().required("비어있어요."),
      question: Yup.string().oneOf(["motherName", "teacherName", "favoriteTour", "petName", "primarySchoolName", "bfName"], 'Invalid Type').required('비어있어요'),
      answer: Yup.string().max(15, "15 글자를 넘을 수 없어요.").required("비어있어요."),
      side: Yup.string().oneOf(["lion", "eagle", "tiger"], 'Invalid Type').required('비어있어요'),
    }),
  });



    return (
      <ChakraProvider>
        <main>
          {
            response && response.type === 'success' ?
              (
                <Alert type={'회원가입 성공!'} message={response.message} modalOpen={true} />
              )
              : response && response.type === 'error' &&
              (
                <Alert type={'회원가입 실패'} message={response?.message} modalOpen={true} />
              )
          }
          <Header />
          <Breadcrumb items={items} />
          <div className='container' style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
            <form onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
              // submit(formik.values);
            }}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!formik.touched.id && !!formik.errors.id}>
                  <FormLabel htmlFor="id" style={labelStyle}>아이디</FormLabel>
                  <Input
                    id="id"
                    name="id"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.id}
                  />
                  <FormErrorMessage>{formik.errors.id}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!formik.touched.password_1 && !!formik.errors.password_1}>
                  <FormLabel htmlFor="password_1" style={labelStyle}>비밀번호</FormLabel>
                  <Input
                    id="password_1"
                    name="password_1"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password_1}
                  />
                  <FormErrorMessage>{formik.errors.password_1}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!formik.touched.password_2 && !!formik.errors.password_2}>
                  <FormLabel htmlFor="password_2" style={labelStyle}>비밀번호 확인</FormLabel>
                  <Input
                    id="password_2"
                    name="password_2"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password_2}
                  />
                  <FormErrorMessage>{formik.errors.password_2}</FormErrorMessage>
                </FormControl>

                {/* "teacherName", "favoriteTour", "petName", "primarySchoolName", "bfName" */}
                <FormControl>
                  <FormLabel htmlFor="question" style={labelStyle}>질문</FormLabel>
                  <Select id="question" name="question"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.question}
                    style={labelStyle}
                  >
                    <option value="teacherName">가장 존경했던 선생님의 이름은 무엇인가요?</option>
                    <option value="favoriteTour">가장 기억에 남는 여행지의 이름은 무엇인가요?</option>
                    <option value="petName">반려동물의 이름은 무엇인가요?</option>
                    <option value="primarySchoolName">당신의 초등학교 이름은 무엇인가요?</option>
                    <option value="bfName">가장 친했던 친구의 이름은 무엇인가요?</option>
                  </Select>
                </FormControl>

                <FormControl isInvalid={!!formik.touched.answer && !!formik.errors.answer}>
                  <FormLabel htmlFor="answer" style={labelStyle}>대답</FormLabel>
                  <Input
                    id="answer"
                    name="answer"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.answer}
                  />
                  <FormErrorMessage>{formik.errors.answer}</FormErrorMessage>
                </FormControl>

                {/* "lion", "eagle", "tiger" */}
                <FormControl>
                  <FormLabel htmlFor="side" style={labelStyle}>진영</FormLabel>
                  <Select id="side" name="side"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.side}
                    style={labelStyle}
                  >
                    <option value="lion">사자</option>
                    <option value="eagle">독수리</option>
                    <option value="tiger">호랑이</option>
                  </Select>
                </FormControl>

                <Button type="submit" colorScheme="purple" width="full" isLoading={loading}>
                  회원가입
                </Button>
              </VStack>
            </form>
          </div>
        </main>
      </ChakraProvider>
    );
}