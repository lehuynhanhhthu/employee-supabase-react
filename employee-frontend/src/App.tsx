import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

type Employee = {
  id: number
  created_at: string
  name: string
  avatar: string
}

// Đường dẫn gốc tới kho ảnh của Thư trên Supabase
const AVATAR_BASE_URL = "https://leftevzynfklgwfggugp.supabase.co/storage/v1/object/public/avatars/"

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [message, setMessage] = useState('')

  // 1. Hàm lấy danh sách nhân viên
  async function fetchEmployees() {
    setLoading(true)
    const { data, error } = await supabase
      .from('employee')
      .select('*')
      .order('id', { ascending: true })

    if (error) setMessage(`Lỗi: ${error.message}`)
    else setEmployees(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  // 2. Hàm cập nhật tên nhân viên
  async function updateEmployee(id: number) {
    if (!editingName.trim()) return
    const { error } = await supabase
      .from('employee')
      .update({ name: editingName })
      .eq('id', id)

    if (error) setMessage(`Lỗi sửa: ${error.message}`)
    else {
      setMessage('Cập nhật thành công!')
      setEditingId(null)
      fetchEmployees()
    }
  }

  // 3. Hàm xóa nhân viên
  async function deleteEmployee(id: number) {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return
    const { error } = await supabase.from('employee').delete().eq('id', id)

    if (error) setMessage(`Lỗi xóa: ${error.message}`)
    else {
      setMessage('Đã xóa nhân viên!')
      fetchEmployees()
    }
  }

  // Định dạng ngày dd/MM/yyyy
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
  }

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <h1>Quản lý nhân viên</h1>
          <button className="refresh-btn" onClick={fetchEmployees}>Tải lại</button>
        </div>
        
        {message && <p className="message">{message}</p>}

        {loading ? <p>Đang tải dữ liệu...</p> : (
          <table>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Tên nhân viên</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <img className="avatar-img" src={`${AVATAR_BASE_URL}${emp.avatar}`} alt="avatar" />
                  </td>
                  <td>
                    {editingId === emp.id ? (
                      <input 
                        className="edit-input"
                        value={editingName} 
                        onChange={e => setEditingName(e.target.value)} 
                      />
                    ) : emp.name}
                  </td>
                  <td>{formatDate(emp.created_at)}</td>
                  <td>
                    <div className="actions">
                      {editingId === emp.id ? (
                        <>
                          <button onClick={() => updateEmployee(emp.id)}>Lưu</button>
                          <button className="secondary" onClick={() => setEditingId(null)}>Hủy</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(emp.id); setEditingName(emp.name); }}>Sửa</button>
                          <button className="danger" onClick={() => deleteEmployee(emp.id)}>Xóa</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App