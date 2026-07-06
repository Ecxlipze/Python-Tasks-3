async function getProjects() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
 const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/projects/`
);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
}
export default async function ProjectsPage() {
  const projects = await getProjects();
 return (
    <main>
      <h1>Projects</h1>
      <ul>
        {projects.map((project: any) => (
          <li key={project.id}>
            <h3>{project.name}</h3>

            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}