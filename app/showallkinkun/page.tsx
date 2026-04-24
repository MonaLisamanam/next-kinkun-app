"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Kinkun } from "@/types/kinkun";

export default function ShowAllKinkunPage() {
  const [foods, setFoods] = useState<Kinkun[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("kinkun_tbl")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      alert(error.message);
    } else {
      setFoods(data || []);
    }

    setLoading(false);
  };

  const deleteFood = async (item: Kinkun) => {
  const ok = confirm(`ต้องการลบ "${item.food_name}" ใช่ไหม?`);
  if (!ok) return;

  if (item.food_image) {
    const fileName = item.food_image.split("/").pop();

    if (fileName) {
      await supabase.storage.from("kinkun_bk").remove([fileName]);
    }
  }

  const { error } = await supabase
    .from("kinkun_tbl")
    .delete()
    .eq("id", item.id);

  if (error) {
    alert(error.message);
    return;
  }

  fetchFoods();
};

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <section className="mx-auto max-w-5xl rounded bg-white p-6 shadow">
        <div className="text-center">
          <h1 className="font-bold text-blue-700">
            Kinkun APP &#40;Supabase&#41;
          </h1>
          <p className="font-semibold text-blue-600">ข้อมูลการกินกัน</p>

          <img
            src="/logo.png"
            alt="logo"
            className="mx-auto mt-3 h-20 w-20 object-contain"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            href="/addkinkun"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            เพิ่มรายการ
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm text-gray-900">
            <thead>
                <tr className="bg-gray-200 text-gray-900">
                    <th className="border border-gray-400 p-2">รูปกิน</th>
                    <th className="border border-gray-400 p-2">กินอะไร</th>
                    <th className="border border-gray-400 p-2">กินที่ไหน</th>
                    <th className="border border-gray-400 p-2">ราคา</th>
                    <th className="border border-gray-400 p-2">วันที่เพิ่ม</th>
                    <th className="border border-gray-400 p-2">ACTION</th>
                </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    กำลังโหลด...
                  </td>
                </tr>
              ) : foods.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                foods.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-400 p-2 text-center">
                      {item.food_image ? (
                        <img
                          src={item.food_image}
                          alt={item.food_name}
                          className="mx-auto h-16 w-16 object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="border border-gray-400 p-2">
                        {item.food_name}
                    </td>

                    <td className="border border-gray-400 p-2">
                        {item.food_shop}
                    </td>

                    <td className="border border-gray-400 p-2 text-right">
                      {item.food_price}
                    </td>

                    <td className="border border-gray-400 p-2 text-center">
                      {new Date(item.created_at).toLocaleDateString("th-TH")}
                    </td>

                    <td className="border border-gray-400 p-2 text-center">
                      <Link
                        href={`/updatekinkun/${item.id}`}
                        className="mr-3 font-bold text-green-600"
                      >
                        แก้ไข
                      </Link>

                      <button
                        onClick={() => deleteFood(item)}
                        className="font-bold text-red-600"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 underline">
            กลับหน้าหลัก
          </Link>
        </div>

        <footer className="mt-8 text-center text-xs text-gray-500">
          <p>Created by Panithan</p>
          <p>Copyright © 2025 All rights reserved</p>
        </footer>
      </section>
    </main>
  );
}