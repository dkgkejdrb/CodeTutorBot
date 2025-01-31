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
  const user_id = useSelector((state: RootState) => state.auth.id);

  // useEffect(()=>{
  //   console.log(isLogin);
  //   console.log(token);
  // }, [isLogin])

  return (
    <main className="w-full flex flex-col justify-center items-center">
      <Header isLogin={isLogin} user_id={user_id}/>
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
      <div className='container flex flex-col test-description'>

          <h1 style={{ textAlign: 'center' }}>사용성 테스트에 참여해주셔서 감사합니다.</h1>
          <h1 style={{ textAlign: 'center' }}>아래 내용들을 살펴보시고 사용성 테스트에 참여해주세요.</h1>
        <section className="research-summary" style={{ marginTop: '20px' }}>
          <h2>연구 개요</h2>
          <p>본 시스템은 기존 온라인 저지 시스템과 LLM을 결합하여 AI 코드 리뷰 및 엄격한 채점 기능을 제공하는 것이 특징입니다.</p>
        </section>

        <section className="study-details" style={{ marginTop: '45px' }}>
          <h2>연구 진행 안내</h2>
          <p>📅 <strong>테스트 기간:</strong> 2025.02.06 ~ 2025.02.13</p>
          <p>🕒 <strong>평균 소요 시간:</strong> 60±25분</p>
          <p>🎯 <strong>참여 대상:</strong> Python 기초 문법 경험이 있는 초·중등 학생 (총 20명)</p>
        </section>
        
        <section className="usage-guide" style={{ marginTop: '45px' }}>
          <h2>시스템 사용법</h2>
          <p>아래 영상을 통해 AI 코드 리뷰 시스템을 사용하는 방법을 확인하세요!</p>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/IdpB4Ic_wxQ?si=ysDhaOqQcJt7s7PN" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
        </section>


        <section className="contact" style={{ marginTop: '45px' }}>
          <h2>연구 책임자 & 문의</h2>
          <p><strong>이동규 (Mark)</strong> - 한양대학교 M&A Lab 연구원, D.LAB 연구원</p>
          <p>📞 <strong>연락처:</strong> 010-8393-9101</p>
          <p>🏢 <strong>연구실 위치:</strong> 한양대학교 산학기술관 714호</p>
        </section>

      </div>


    </main>
  );
}