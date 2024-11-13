import React, { useState, useEffect } from 'react';

const UserManagement = ({ users, setUsers }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editUsername, setEditUsername] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
        setUsers(data); // Update the state with fetched users
      } catch (error) {
        console.error('Error fetching users:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [setUsers]); // Add setUsers to dependencies

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to delete user');
      setUsers(users.filter((user) => user.user_id !== id));
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      setError('Error deleting user. Please try again later.');
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.user_id);
    setEditUsername(user.username);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${editUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: editUsername }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update user');
      setUsers(users.map((user) =>
        user.user_id === editUserId ? { ...user, username: editUsername } : user
      ));
      setEditUserId(null);
      setEditUsername('');
    } catch (error) {
      console.error(`Error updating user with ID ${editUserId}:`, error);
      setError('Error updating user. Please try again later.');
    }
  };

  const cancelEdit = () => {
    setEditUserId(null);
    setEditUsername('');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="section">
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="2">No users available</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.user_id}>
                <td>
                  {editUserId === user.user_id ? (
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editUserId === user.user_id ? (
                    <>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        disabled={editUserId !== null && editUserId !== user.user_id}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(user.user_id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;