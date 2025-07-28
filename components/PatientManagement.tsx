import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

interface Patient {
  id?: string;
  providerId: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  notes?: string;
}

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState<Partial<Patient>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, 'patients'), where('providerId', '==', user.uid));
      const snap = await getDocs(q);
      setPatients(snap.docs.map(d => ({ ...d.data(), id: d.id }) as Patient));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      if (editingId) {
        const { id, ...fields } = form;
        await updateDoc(doc(db, 'patients', editingId), fields);
      } else {
        await addDoc(collection(db, 'patients'), { ...form, providerId: user.uid });
      }
      setForm({});
      setEditingId(null);
      fetchPatients();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Patient) => {
    setForm(p);
    setEditingId(p.id!);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'patients', id));
      fetchPatients();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Patient Management</h3>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
        <input required placeholder="First Name" value={form.firstName||''} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))} className="border p-1 rounded" />
        <input required placeholder="Last Name" value={form.lastName||''} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))} className="border p-1 rounded" />
        <input required type="date" placeholder="DOB" value={form.dob||''} onChange={e=>setForm(f=>({...f,dob:e.target.value}))} className="border p-1 rounded" />
        <input required type="email" placeholder="Email" value={form.email||''} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className="border p-1 rounded" />
        <input placeholder="Notes" value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} className="border p-1 rounded" />
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">{editingId?'Update':'Add'}</button>
        {editingId && <button type="button" onClick={()=>{setForm({});setEditingId(null);}} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>}
      </form>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full text-left">
        <thead><tr><th>First</th><th>Last</th><th>DOB</th><th>Email</th><th>Notes</th><th>Actions</th></tr></thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id} className="border-b">
              <td>{p.firstName}</td><td>{p.lastName}</td><td>{p.dob}</td><td>{p.email}</td><td>{p.notes}</td>
              <td>
                <button onClick={()=>handleEdit(p)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={()=>handleDelete(p.id!)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientManagement;
