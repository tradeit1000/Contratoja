"use client";
import dynamic from "next/dynamic";

const SuccessContent = dynamic(() => import("../../components/SuccessContent"), { ssr: false });

export default function SuccessPage() {
  return <SuccessContent />;
}
