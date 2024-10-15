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
  const [isEditing, setIsEditing] = useState<string | null>(null); // สำหรับจัดการการแก้ไข
  const [formData, setFormData] = useState<User>({
    _id: '',
    username: '',
    email: '',
    firstName: '',
    lastName: ''
  });
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

  // ฟังก์ชันสำหรับการลบผู้ใช้
  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?");
    if (confirmed) {
      try {
        await fetch(`/api/auth/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setUsers(users.filter(user => user._id !== userId)); // อัปเดต state หลังจากลบสำเร็จ
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // ฟังก์ชันสำหรับการแก้ไขผู้ใช้
  const handleEdit = (user: User) => {
    setIsEditing(user._id);
    setFormData(user);
  };

  // ฟังก์ชันสำหรับบันทึกการแก้ไขและบันทึกข้อมูลไปยังฐานข้อมูล
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/auth/users/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // ส่งข้อมูลที่ถูกแก้ไขไปยัง API
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => (user._id === formData._id ? updatedUser.user : user)));
        setIsEditing(null); // ยกเลิกโหมดแก้ไข
      } else {
        console.error('Error updating user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
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
            <th style={styles.th}>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>
                {isEditing === user._id ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td style={styles.td}>
                {isEditing === user._id ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td style={styles.td}>
                {isEditing === user._id ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                ) : (
                  user.firstName
                )}
              </td>
              <td style={styles.td}>
                {isEditing === user._id ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                ) : (
                  user.lastName
                )}
              </td>
              <td style={styles.td}>
                {isEditing === user._id ? (
                  <button onClick={handleSave} style={styles.saveButton}>บันทึก</button>
                ) : (
                  <button onClick={() => handleEdit(user)} style={styles.editButton}>แก้ไข</button>
                )}
                <button onClick={() => handleDelete(user._id)} style={styles.deleteButton}>ลบ</button>
              </td>
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
  editButton: {
    backgroundColor: '#f0ad4e',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  saveButton: {
    backgroundColor: '#5cb85c',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
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
