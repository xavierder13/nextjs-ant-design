import { notFound } from "next/navigation";

async function fetchUser(id: string) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  
  if(!response.ok)
  {
    return null;
  }

  const user = await response.json();
  return user;
}

export default async function UserPage({params} : {
  params: Promise <{ userId: String }>
}) {

  const { userId } = await params;
  const user = await fetchUser(userId);
  if(!user)
  {
    notFound();
  }
  
  return (
    <div>
      <h1>{ user.name }</h1>
      <p>
        <strong>Email:</strong> { user.email }
      </p>
      <p>
        <strong>Phone:</strong> { user.phone }
      </p>
      <p>
        <strong>Username:</strong> { user.username }
      </p>
      <p>
        <strong>Website:</strong> { user.website }
      </p>
    </div>
  )
}