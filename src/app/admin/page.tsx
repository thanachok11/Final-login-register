"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null); // สำหรับแสดง email ที่ล็อกอินอยู่
  const router = useRouter();

  // ดึงข้อมูลผู้ใช้ทั้งหมดเมื่อหน้าโหลด
  useEffect(() => {
    fetch('/api/auth/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users); // สมมติว่าคุณดึงข้อมูลผู้ใช้จาก API
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });

    // ดึงข้อมูล email ของผู้ใช้ที่ล็อกอิน
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ยินดีต้อนรับสู่หน้าแอดมิน</h1>
      {userEmail && <p style={styles.userEmail}>คุณล็อกอินในฐานะ: {userEmail}</p>}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ลำดับ</th>
              <th style={styles.th}>ชื่อ</th>
              <th style={styles.th}>อีเมล</th>
              <th style={styles.th}>ชื่อจริง</th>
              <th style={styles.th}>นามสกุล</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.firstName}</td> 
                <td style={styles.td}>{user.lastName}</td>   
              </tr>
            ))}
          </tbody>
        </table>

      <button onClick={handleLogout} style={styles.logoutButton}>ออกจากระบบ</button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  userEmail: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '30px',
  },
  table: {
    width: '80%',
    borderCollapse: 'collapse',
    margin: '20px 0',
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    backgroundColor: '#f4f4f4',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
  },
  logoutButton: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};
