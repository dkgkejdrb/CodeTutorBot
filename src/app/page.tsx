// 2024.08.06: 랜딩 페이지
"use client";

import { Carousel } from 'antd';
import Header from '../app/components/Header';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useEffect } from 'react';
import Image from 'next/image';

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
    <main className="w-full flex flex-col justify-center items-center">
      <Header isLogin={isLogin}/>
      {/* <div className="w-full">
        <div className="container mx-auto md lg xl">
          <Carousel arrows infinite={true} autoplay>
          <div>
            <Image layout="responsive" width={1170} height={488} src={"https://codetutorbot.blob.core.windows.net/image/testBanner.jpg"} unoptimized={true} alt="" />
          </div>
          <div>
            <Image layout="responsive" width={1170} height={488} src={"https://codetutorbot.blob.core.windows.net/image/testBanner.jpg"} unoptimized={true} alt="" />
          </div>
        </Carousel>
        </div>
      </div> */}
      <section className="w-full bg-gray-100 py-8">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
          <h2 className="text-2xl font-bold text-center mb-4">시스템 소개</h2>
          <p className="text-center text-gray-700">
            저희 시스템은 사용자들이 다양한 문제를 풀고, 자신의 실력을 향상시킬 수 있도록 도와줍니다. 
            다양한 문제와 해설을 통해 학습을 더욱 효과적으로 할 수 있습니다.
          </p>
        </div>
      </section>
      <section className="w-full py-8">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
          <h2 className="text-2xl font-bold text-center mb-4">공지사항</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>메인 배너 테스트 기간: 2024년 1월 1일 ~ 2024년 1월 31일</li>
            <li>새로운 문제 추가: 2024년 2월 1일</li>
            <li>시스템 업데이트 예정: 2024년 3월 1일</li>
          </ul>
        </div>
      </section>
      <section className="w-full bg-gray-100 py-8">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
          <h2 className="text-2xl font-bold text-center mb-4">사용자 리뷰</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-1/2 lg:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-700">"이 시스템 덕분에 많은 것을 배웠습니다!"</p>
                <p className="text-gray-500 text-sm mt-2">- 사용자 A</p>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-700">"문제가 다양하고 해설이 잘 되어 있어요."</p>
                <p className="text-gray-500 text-sm mt-2">- 사용자 B</p>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-700">"매일 새로운 문제를 풀 수 있어서 좋아요."</p>
                <p className="text-gray-500 text-sm mt-2">- 사용자 C</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}