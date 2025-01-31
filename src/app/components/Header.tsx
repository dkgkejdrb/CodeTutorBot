// 2024.08.07: 헤더
"use client";

import './Header.css'
import { Menu } from 'antd';
import Image from 'next/image';
import headerLogo from '/public/LOGO.png';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { clearId, clearToken } from '@/store/slices/authSlice';

const navItems = [
  {
    label: 'Problems',
    key: 'exercise',
    children: [
      {
        label: <Link href="/problems">Python Problems</Link>,
        key: 'exerciseTotal',
        
        
      },
      // {
      //   label: '단계별로 풀기',
      //   key: 'exerciseLevel'
      // }
    ]
  },
  // {
  //   label: '랭킹',
  //   key: 'rank',
  // },
  // {
  //   label: '문의',
  //   key: 'contact',
  // },
]

const linkSytle = {
textDecorationLine: "none", color: "#7c8082"
}

interface headerProps {
  isLogin: boolean;
  user_id: string | null;
}

export default function Home({isLogin, user_id}:headerProps)  {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(clearToken());
    dispatch(clearId());
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
                      <Link href="/login" style={linkSytle}>Sign in</Link>
                    </li>
                    <div className='topbar-devider'></div>
                    <li>
                      <Link href="/register" style={linkSytle}>Sign up</Link>
                    </li>
                  </ul>
                </>
                :
                <>
                  <ul>
                    <div style={{marginRight: '10px'}}>
                      {`Hi, ${user_id}`}
                    </div>
                    <div style={{marginRight: '10px'}}>
                      {`|`}
                    </div>
                    {/* <li>
                      <Link href="/register" style={linkSytle}>My page</Link>
                    </li>
                    <div className='topbar-devider'></div> */}
                    <li>
                      <Link href='/' onClick={logoutHandler} style={linkSytle}>
                        {`Sign out`}
                      </Link>
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
            <Menu mode="horizontal" items={navItems}></Menu>
          </div>
        </div>
      </div>
  );
}