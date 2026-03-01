

export default async function Contact() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();
  return (
    
    <div>
      {" "}
      <h1>User List</h1>
      <ul>
        {
          users.map((user: { id: number; name: string}) => (
            <li key={user.id}>
              <h3>{user.name}</h3>
            </li>
          ))
        }
        <li></li>
      </ul>
      User Page
      {" "}
    </div>
    
  )

}