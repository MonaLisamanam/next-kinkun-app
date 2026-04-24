"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Kinkun } from "@/types/kinkun";

export default function UpdateKinkunPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const id = params.id as string;

  const [oldData, setOldData] = useState<Kinkun | null>(null);
  const [foodShop, setFoodShop] = useState("");
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFood = async () => {
    const { data, error } = await supabase
      .from("kinkun_tbl")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setOldData(data);
    setFoodName(data.food_name);
    setFoodShop(data.food_shop);
    setFoodPrice(String(data.food_price));
  };

  const uploadImage = async () => {
    if (!imageFile) return oldData?.food_image || null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("kinkun_bk")
      .upload(fileName, imageFile);

    if (error) throw error;

    const { data } = supabase.storage.from("kinkun_bk").getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleUpdate = async () => {
    if (!foodName || !foodShop || !foodPrice) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImage();

      const { error } = await supabase
        .from("kinkun_tbl")
        .update({
          food_name: foodName,
          food_shop: foodShop,
          food_price: Number(foodPrice),
          food_image: imageUrl,
        })
        .eq("id", id);

      if (error) throw error;

      alert("แก้ไขข้อมูลสำเร็จ");
      router.push("/showallkinkun");
    } catch (err) {
      const error = err as Error;
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFood();
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-gray-900">
      <section className="mx-auto max-w-4xl">
        <div className="rounded bg-white px-8 py-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-lg font-bold text-blue-700">
              Kinkun APP &#40;Supabase&#41;
            </h1>
            <p className="font-bold text-blue-600">แก้ไขข้อมูลการกิน</p>

            <img
              src="/logo.png"
              alt="logo"
              className="mx-auto mt-4 h-20 w-20 object-contain"
            />
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <label className="text-sm font-bold">กินอะไร</label>
              <input
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="เช่น Pizza, KFC, ..."
                className="mt-1 w-full rounded-sm border border-gray-400 px-3 py-2 text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="text-sm font-bold">กินที่ไหน</label>
              <input
                value={foodShop}
                onChange={(e) => setFoodShop(e.target.value)}
                placeholder="เช่น KFC หนองมน, Pizza หน้ามอเอเชีย, ..."
                className="mt-1 w-full rounded-sm border border-gray-400 px-3 py-2 text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="text-sm font-bold">
                กินไปเท่าไหร่ &#40;บาท&#41;
              </label>
              <input
                type="number"
                value={foodPrice}
                onChange={(e) => setFoodPrice(e.target.value)}
                placeholder="เช่น 100, 29950, ..."
                className="mt-1 w-full rounded-sm border border-gray-400 px-3 py-2 text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold">รูปกิน</label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 rounded bg-blue-600 px-8 py-2 text-sm font-bold text-white hover:bg-blue-700"
              >
                เลือกรูป
              </button>

              {imageFile && (
                <p className="mt-1 text-xs text-gray-600">
                  ไฟล์ที่เลือก: {imageFile.name}
                </p>
              )}

              {oldData?.food_image && (
                <img
                  src={oldData.food_image}
                  alt={oldData.food_name}
                  className="mt-3 h-28 w-28 rounded object-cover"
                />
              )}
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="mt-3 w-full rounded bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "กำลังแก้ไข..." : "แก้ไขการกิน"}
            </button>
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/showallkinkun"
              className="text-sm text-blue-600 underline"
            >
              กลับไปหน้าแสดงข้อมูลการกิน
            </Link>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-gray-600">
          <p>Created by Panithan</p>
          <p>Copyright © 2025 All rights reserved.</p>
        </footer>
      </section>
    </main>
  );
}