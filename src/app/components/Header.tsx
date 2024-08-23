// 2024.08.07: 헤더
"use client";

import './Header.css'
import { Menu } from 'antd';
import Image from 'next/image';
import headerLogo from '/public/headerLogo.png';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { clearToken } from '@/store/slices/authSlice';

const navItems = [
  {
    label: '문제',
    key: 'exercise',
    children: [
      {
        label: <Link href="/problems">전체 문제</Link>,
        key: 'exerciseTotal',
        
        
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

interface headerProps {
  isLogin: boolean;
}

export default function Home({isLogin}:headerProps)  {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(clearToken());
  }
  return (
      <div className='header'>
        <div className='topBar'>
          <div className='container'>
            <div className='loginBar'>
            {
              !isLogin ?
                <>
                  <ul>
                    <li>
                      <Link href="/login" style={linkSytle}>로그인</Link>
                    </li>
                    <div className='topbar-devider'></div>
                    <li>
                      <Link href="/register" style={linkSytle}>회원가입</Link>
                    </li>
                  </ul>
                </>
                :
                <>
                  <ul>
                    <li>
                      <Link href="/register" style={linkSytle}>마이페이지</Link>
                    </li>
                    <div className='topbar-devider'></div>
                    <li>
                      <Link href='/' onClick={logoutHandler} style={linkSytle}>로그아웃</Link>
                    </li>
                  </ul>
                </>
            }
            </div>
          </div>
        </div>
        <div className="navBar">
          <div className='container'>
            <div className='brand'>
              <Link href={'/'}>
                <Image width={210} height={66} src={headerLogo} alt="" style={{ position: "absolute", bottom: "-46px"}} />
              </Link>
            </div>            
            <Menu mode="horizontal" items={navItems} style={{ fontSize: 14 }}></Menu>
          </div>
        </div>
      </div>
  );
}