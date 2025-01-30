// Judge0 API DOCS: https://ce.judge0.com/
import { NextResponse } from 'next/server';
const axios = require('axios')

const KEY = process.env.X_RAPIDAPI_KEY;

const createSubmissions = (data: any) => {
  // stdin이 존재하는 경우와 존재하지 않는 경우 분기 처리
  const submissions = data.expected_output.map((input: any, index: any) => {
    const submission: any = {
      language_id: 71, // 예: Python 3.8.1
      source_code: data.source_code,
      expected_output: data.expected_output[index],
      cpu_time_limit: data.cpu_time_limit,
      memory_limit: data.memory_limit,
    };

    // stdin 배열이 존재하면 추가
    if (data.stdin && Array.isArray(data.stdin)) {
      submission.stdin = data.stdin[index];
    }

    return submission;
  });

  return submissions;
};


export async function POST(request: Request) {
  const content = await request.json();
  // console.log(content);

  const option_creation_submission = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      //   base64_encoded: 'true',
      //   wait: 'false',
      //   fields: '*'
    },
    headers: {
      'x-rapidapi-key': 'f54a007339msh4a1a11a38459fe9p1d7d8fjsn67f89e4444c0',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      submissions: createSubmissions(content)
    }
  };

  // console.log(createSubmissions(content))


  try {
    const response = await axios.request(option_creation_submission);
    const tokens = (response.data as { token: string }[]).map(item => item.token).join(',');
    // console.log(tokens);

    const option_get_submission = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/batch`,
      params: {
        base64_encoded: 'true',
        tokens: tokens,
        fields: '*'
      },
      headers: {
        'x-rapidapi-key': 'f54a007339msh4a1a11a38459fe9p1d7d8fjsn67f89e4444c0',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(option_get_submission);

      // console.log(response.data);
      return NextResponse.json(response.data);

    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}