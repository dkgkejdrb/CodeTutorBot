// 2024.08.06: 랜딩 페이지
"use client";

import './landingPage.css'
import { useRef, useEffect, useState, createContext, Children } from "react";
import { Menu } from 'antd';

const navItems = [
  {
    label: '문제',
    key: 'exercise',
    children: [
      {
        label: '전체 문제',
        key: 'exerciseTotal'
      },
      {
        label: '단계별로 풀기',
        key: 'exerciseLevel'
      }
    ]
  },
  {
    label: '랭킹',
    key: 'rank',
  },
  {
    label: '문의',
    key: 'contact',
  },
]

export default function Home() {
  return (
    <main>
      <div className='header'>
        <div className='topBar'>
          <div className='container'>
            <div className='loginBar'>
              <ul>
                <li>로그인</li>
                <div className='topbar-devider'></div>
                <li>회원가입</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="navBar">
          <Menu mode="horizontal" items={navItems} style={{ fontSize: 14 }}></Menu>
        </div>
      </div>
      <div className="mainBanner">

      </div>
      <div className="container">

      </div>
    </main>
  );
}