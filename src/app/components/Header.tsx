// 2024.08.07: 헤더
"use client";

import './Header.css'
import { Menu, Carousel } from 'antd';
import Image from 'next/image';
import headerLogo from '/public/headerLogo.png';
import Link from 'next/link';

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

const linkSytle = {
textDecorationLine: "none", color: "#7c8082"
}

export default function Home() {
  return (
    <main>
      <div className='header'>
        <div className='topBar'>
          <div className='container'>
            <div className='loginBar'>
              <ul>
                <li>
                  <Link href="/login" style={linkSytle}>로그인</Link>
                </li>
                <div className='topbar-devider'></div>
                <li>
                  <Link href="/register" style={linkSytle}>회원가입</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="navBar">
          <div className='container'>
            <div className='brand'>
              <Image width={210} height={66} src={headerLogo} alt="" style={{ position: "absolute", bottom: "-46px"}} />
            </div>            
            <Menu mode="horizontal" items={navItems} style={{ fontSize: 14 }}></Menu>
          </div>
        </div>
      </div>
    </main>
  );
}