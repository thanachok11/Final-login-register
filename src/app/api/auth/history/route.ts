// ตัวอย่าง API สำหรับดึงข้อมูลประวัติการรักษา
import { NextResponse } from 'next/server';

// ข้อมูลประวัติตัวอย่าง
const history = [
  { id: 1, date: '2024-09-15', description: 'การตรวจสุขภาพทั่วไป', doctor: 'Dr. Smith', status: 'เสร็จสิ้น' },
  { id: 2, date: '2024-08-10', description: 'การตรวจร่างกายประจำปี', doctor: 'Dr. Johnson', status: 'เสร็จสิ้น' },
];

export async function GET() {
  try {
    // ส่งข้อมูลประวัติการรักษากลับไป
    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch history' }, { status: 500 });
  }
}
