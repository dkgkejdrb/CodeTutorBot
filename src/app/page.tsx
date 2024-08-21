// 2024.08.06: 랜딩 페이지
"use client";

import { Carousel } from 'antd';
import Header from '../app/components/Header';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useEffect } from 'react';

const contentStyle = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  background: '#364d79',
};

export default function Home() {
  // const isLogin = useSelector((state: RootState) => state.authSlice.isLogin);
  // const token = useSelector((state: RootState) => state.authSlice.token);
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(()=>{
    console.log(isLogin);
    console.log(token);
  }, [isLogin])

  return (
    <main>
      <Header />
      <div className="mainBanner">
        <div className='container'>
        <Carousel arrows infinite={false}>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
    </div>
      </div>
      <div className="container">

      </div>
    </main>
  );
}