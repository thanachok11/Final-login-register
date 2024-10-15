"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/navbar'; // Import Navbar
import styles from './ProfilePage.module.css'; // Import styles (ใช้ไฟล์ CSS ที่มีอยู่)

interface User {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(true); // สถานะสำหรับการโหลดข้อมูล
  const [error, setError] = useState(''); // สถานะสำหรับแสดงข้อผิดพลาด
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');

  // ฟังก์ชันดึงข้อมูลผู้ใช้จาก API
  const fetchUserData = async () => {
    const token = localStorage.getItem('token'); // ดึง token จาก localStorage
    if (!token) {
      router.push('/login'); // ถ้าไม่มี token ให้ไปหน้า login
      return;
    }

    const res = await fetch('/api/auth/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setForm({
        email: data.user.email,
        username: data.user.username,
        firstName: data.user.firstName,
        lastName: data.user.lastName
      });
      setLoading(false); // หยุดโหลดเมื่อได้ข้อมูล
    } else {
      setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
      setLoading(false); // หยุดโหลดเมื่อเกิดข้อผิดพลาด
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ฟังก์ชัน handleChange สำหรับจัดการกับ input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ฟังก์ชัน submit เพื่ออัปเดตข้อมูลผู้ใช้
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('/api/auth/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccessMessage('อัพเดทข้อมูลสำเร็จแล้ว!!');
    } else {
      alert('ไม่สามารถอัปเดตโปรไฟล์ได้');
    }
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>; // แสดงข้อความระหว่างการโหลด
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar /> {/* แสดง Navbar */}
      <div className={styles.formContainer}>
        <h1 className={styles.title}>โปรไฟล์ของฉัน</h1>
        {user ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <button type="submit" className={styles.button}>อัปเดตโปรไฟล์</button>
            {successMessage && <p className={styles.success}>{successMessage}</p>}
            {error && <p className={styles.error}>{error}</p>} {/* แสดงข้อผิดพลาด */}

          </form>
        ) : (
          <p>ไม่พบข้อมูลผู้ใช้</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
