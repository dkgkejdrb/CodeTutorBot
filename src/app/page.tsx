// 2024.08.06: 랜딩 페이지
"use client";

import { Carousel } from 'antd';
import Header from '../app/components/Header';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useEffect } from 'react';
import Image from 'next/image';

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

  // useEffect(()=>{
  //   console.log(isLogin);
  //   console.log(token);
  // }, [isLogin])

  return (
    <main>
      <Header isLogin={isLogin}/>
      <div className="mainBanner">
        <div className='container'>
        <Carousel arrows infinite={true} autoplay>
        <div>
          <Image width={1170} height={488} src={"https://codetutorbot.blob.core.windows.net/image/testBanner.jpg"} unoptimized={true} alt="" />
        </div>
        <div>
          <Image width={1170} height={488} src={"https://codetutorbot.blob.core.windows.net/image/testBanner.jpg"} unoptimized={true} alt="" />
        </div>
      </Carousel>
    </div>
      </div>
      <div className="container">

      </div>
    </main>
  );
}