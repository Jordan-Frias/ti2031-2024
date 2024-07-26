// components/UserList.js
const UserList = ({ users, onDelete }) => {
    return (
      <div>
        <ul>
          {users.map(user => (
            <li key={user.username} className="text-white">
              {user.username}
              <button onClick={() => onDelete(user.username)} className="bg-red-500 text-white p-1 ml-2 rounded">Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default UserList;
  