import { NextResponse } from 'next/server';

// ข้อมูลการนัดหมายตัวอย่าง
const appointments = [
  { id: 1, date: '2024-10-20', time: '10:00 AM', doctor: 'Dr. Smith', status: 'ยืนยันแล้ว' },
  { id: 2, date: '2024-10-22', time: '2:00 PM', doctor: 'Dr. Johnson', status: 'รอการยืนยัน' },
];

// ฟังก์ชัน GET สำหรับดึงข้อมูลการนัดหมาย
export async function GET() {
  try {
    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching appointments' }, { status: 500 });
  }
}

// ฟังก์ชัน POST สำหรับเพิ่มการนัดหมายใหม่
export async function POST(request: Request) {
  try {
    const newAppointment = await request.json();
    appointments.push(newAppointment); // เพิ่มการนัดหมายใหม่ใน array (ในกรณีนี้ข้อมูลจะไม่ถูกบันทึกถาวร)
    return NextResponse.json({ message: 'Appointment added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding appointment' }, { status: 500 });
  }
}
