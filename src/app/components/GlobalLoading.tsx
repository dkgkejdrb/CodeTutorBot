"use client";

export default function GlobalLoading() {
  return (
    <main className="w-full flex flex-col justify-center items-center">
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-bold mt-4 animate-fade-in" style={{ marginTop: "50%", color: "rgb(39, 39, 83)"}}>Please wait a moment...</h1>

        <style jsx>{`
            /* 텍스트 페이드 인 + 바운스 애니메이션 */
            .animate-fade-in {
            opacity: 0;
            animation: fadeIn 1.5s ease-in-out forwards, bounce 1.2s infinite;
            }

            @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
            }

            @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            }
        `}</style>
        </div>
    </main>
  );
}
