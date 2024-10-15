"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/navbar'; // Import Navbar
import styles from './AppointmentsPage.module.css'; // Import styles (เขียนไฟล์ CSS เพิ่มเติมภายหลัง)

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  status: string;
}

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลการนัดหมายจาก API (คุณสามารถใช้ API ของคุณได้ที่นี่)
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/auth/appointments'); // URL ของ API ที่ดึงข้อมูล
        if (!res.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await res.json();
        setAppointments(data.appointments); // สมมติว่าคุณส่งข้อมูลการนัดหมายกลับมาเป็น array
        setLoading(false);
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลการนัดหมายได้');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.title}>การนัดหมายของคุณ</h1>
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : appointments.length > 0 ? (
          <ul className={styles.appointmentList}>
            {appointments.map((appointment) => (
              <li key={appointment.id} className={styles.appointmentItem}>
                <h2>นัดหมายกับ: {appointment.doctor}</h2>
                <p>วันที่: {appointment.date}</p>
                <p>เวลา: {appointment.time}</p>
                <p>สถานะ: {appointment.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>ไม่มีการนัดหมายที่กำลังจะมาถึง</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
