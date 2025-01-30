import { NextResponse } from 'next/server';
const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = process.env.MONGODB_URI;
const uri = "mongodb+srv://dkgkejdrb:Vkdnjf8710@cluster0.zjhaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function GET(request: Request) {
  try {
      const { searchParams } = new URL(request.url);
      const user_id = searchParams.get("user_id");

      await client.connect();
      const db = client.db("codeTutor");
      const collection = db.collection("user_problems");

      let userProblems: any[] = [];
      let problemStats: Record<string, { totalSubmissions: number, accuracyRate: string }> = {};

      if (user_id) {
          // 🔹 특정 유저가 제출한 모든 문제 데이터 조회
          userProblems = await collection.find({ user_id }).toArray();
      }

      // 🔹 전체 문제에 대한 제출 수 및 정답률 계산
      const pipeline = [
          {
              $group: {
                  _id: "$problem_id",
                  totalSubmissions: { $sum: 1 },
                  correctSubmissions: {
                      $sum: {
                          $cond: [{ $eq: ["$is_correct", "Correct"] }, 1, 0]
                      }
                  }
              }
          }
      ];

      const problemAggregates = await collection.aggregate(pipeline).toArray();

      problemAggregates.forEach((problem: any) => {
          problemStats[problem._id] = {
              totalSubmissions: problem.totalSubmissions,
              accuracyRate: problem.totalSubmissions > 0
                  ? ((problem.correctSubmissions / problem.totalSubmissions) * 100).toFixed(2) + "%"
                  : "0.00%"
          };
      });

      return NextResponse.json({
          type: 'success',
          userProblems,
          problemStats
      });

  } catch (err: any) {
      return NextResponse.json({ type: 'error', message: 'Database query failed', error: err.message }, { status: 500 });
  } finally {
      await client.close();
  }
}