"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (code.trim() === "") {
      alert("กรุณาใส่รหัสก่อน");
      return;
    }

    router.push("/showallkinkun");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-gray-900">
      <section className="mx-auto w-full max-w-2xl">
        <div className="rounded bg-white px-8 py-10 text-center shadow-lg">
          <h1 className="text-lg font-bold text-blue-700">
            Kinkun APP &#40;Supabase&#41;
          </h1>
          <p className="font-bold text-blue-600">บันทึกรายการกินกัน</p>

          <img
            src="/logo.png"
            alt="logo"
            className="mx-auto mt-4 h-24 w-24 object-contain"
          />

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter some code"
            className="mt-6 w-full rounded-sm border border-gray-400 px-3 py-2 text-sm text-gray-900"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 w-full rounded bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            เข้าใช้งาน
          </button>
        </div>

        <footer className="mt-8 text-center text-xs text-gray-600">
          <p>Created by Panithan</p>
          <p>Copyright © 2025 All rights reserved.</p>
        </footer>
      </section>
    </main>
  );
}