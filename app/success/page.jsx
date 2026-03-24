"use client";
import dynamic from "next/dynamic";
export const dynamicPage = "force-dynamic";
const C = dynamic(() => import("../../components/SuccessContent"), { ssr: false });
export default function SuccessPage() { return <C />; }
