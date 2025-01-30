// 비회원 이더라도 문제 페이지의 문제를 볼 수 있음. 단, 문제를 제출할 수는 없음
"use client";

import { SearchOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button, Input, Select, Table, Pagination } from "antd";
import type { TableProps } from 'antd';
import type { PaginationProps } from 'antd';
import { ItemType } from '@/app/components/Breadcrumb';
import Breadcrumb from '@/app/components/Breadcrumb';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation';
const { Column, ColumnGroup } = Table;

const { Option } = Select;

const items: ItemType[] = [
  {
    href: '/problems',
    title: (<>
      Python Problems
    </>)
  }
]

interface DataType {
  key: string;
  isCorrect: string;
  title: string;
  difficulty: string;
  totalSubmissions: string;
  accuracyRate: string;
}

export default function Home() {
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const user_id = useSelector((state: RootState) => state.auth.id);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [response, setResponse] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onChange: PaginationProps['onChange'] = (current) => {
    setLoading(true);
    setPage(current);
  };

  // 페이지 진입 시, isLogin이 false라면 Home으로 이동
  useEffect(() => {
    if (!isLogin) {
      router.push('/login');
      return;
    }
  }, [isLogin]);

  useEffect(() => {
    // /api/problemsList 회원가입 정보 전달
    axios.post('/api/problemsList', { page: page, pageSize: pageSize })
      .then(response => {
        // setLoading(false);
        // const data = response.data.data;

        // const updatedResponse = data.map((_data: any) => ({
        //   // key: _data._id,
        //   key: _data._id,
        //   isCorrect: _data.isCorrect,
        //   title: _data.title,
        //   difficulty: _data.difficulty,
        //   totalSubmissions: _data.totalSubmissions,
        //   accuracyRate: _data.accuracyRate
        // }))

        // setResponse(updatedResponse);

        const data = response.data.data;
        // console.log(data);

        // axios.get('/api/problemsUser', { 
        //   params: {
        //     user_id:  user_id
        //   }
        // })
        //   .then(problemUserResponse => {
        //     const userProblems = problemUserResponse.data.data;
        //     // console.log(userProblems);

        //     const updatedResponse = data.map((problem: any) => {
        //       const userProblem = 
        //         userProblems.find((up: any) => up.problem_id === problem._id);
              
        //       return {
        //         key: problem._id,
        //         isCorrect: userProblem && userProblem.is_correct
        //         ? (userProblem.is_correct === "Correct" ? "Correct" : "Incorrect")
        //         : "Not Attempted",
        //         title: problem.title,
        //         difficulty: problem.difficulty,
        //         totalSubmissions: problem.totalSubmissions,
        //         accuracyRate: problem.accuracyRate
        //       };
        //     });

        //     setResponse(updatedResponse);
        //     setLoading(false);
        //   });


      axios.get('/api/problemsUser', { 
        params: { user_id: user_id }
      })
      .then(problemUserResponse => {
          const userProblems = problemUserResponse.data.userProblems;
          const problemStats = problemUserResponse.data.problemStats;
          
          const updatedResponse = data.map((problem: any) => {
              const userProblem = userProblems.find((up: any) => up.problem_id === problem._id);
              const stats = problemStats[problem._id] || { totalSubmissions: 0, accuracyRate: "0.00%" };
      
              return {
                  key: problem._id,
                  isCorrect: userProblem && userProblem.is_correct
                      ? (userProblem.is_correct === "Correct" ? "Correct" : "Incorrect")
                      : "Not Attempted",
                  title: problem.title,
                  difficulty: problem.difficulty,
                  totalSubmissions: stats.totalSubmissions,
                  accuracyRate: stats.accuracyRate
              };
          });
      
          setResponse(updatedResponse);
          setLoading(false);
      })
      .catch(error => {
          console.error('에러 발생:', error);
      });
      
      })
      .catch(error => {
        setLoading(false);
        //   console.error('에러 발생:', error);
      });
  }, [page])

  // useEffect(()=>{
  //   console.log(response);
  // },[response])

  return (
    <main>
      <Header isLogin={isLogin} />
      <Breadcrumb items={items} />
      {/* <div className='problems container' style={{ paddingTop: 40 }}>
        <div className='searchBar' style={{ display: "flex" }}>
          <div style={{ display: "flex", width: "50%" }}>
            <Select placeholder="상태">
              <Option value="">NaN</Option>
            </Select>
            <Select placeholder="난이도" style={{ marginLeft: 15 }}>
              <Option value="">NaN</Option>
            </Select>
            <Select placeholder="언어" style={{ marginLeft: 15 }}>
              <Option value="">NaN</Option>
            </Select>
            <Select placeholder="기출문제 모음" style={{ marginLeft: 15 }}>
              <Option value="">NaN</Option>
            </Select>
          </div>
          <div style={{ display: "flex", width: "50%" }}>
            <Input placeholder="풀고 싶은 문제 제목, 기출문제 검색"></Input>
            <Button type="primary" shape="circle" icon={<SearchOutlined />} />
          </div>
        </div>
      </div> */}
      <div className='problems container' style={{ paddingTop: 24 }}>
        <Table dataSource={response} loading={!response}>
          <Column title="Status" dataIndex="isCorrect" key="isCorrect" width="10%" />
          <Column title="Title" dataIndex="title" key="title" width="30%" 
            render={(text)=>(<a>{text}</a>)}
            onCell={(record: any, index) => {
              return {
                onClick: () => {
                  // router.push(`/problem/${record.key}`)
                  router.push(`/problems/problem/${record.key}`)
                }
              }
            }}
          />
          {/* <Column title="Difficulty" dataIndex="difficulty" key="difficulty" width="20%" /> */}
          <Column title="Total Submissions" dataIndex="totalSubmissions" key="totalSubmissions" width="10%" />
          <Column title="Accuracy Rate" dataIndex="accuracyRate" key="accuracyRate" width="10%" />
        </Table>
      </div>
      {/* <Pagination onChange={onChange} total={pageSize} /> */}
    </main>
  );
}