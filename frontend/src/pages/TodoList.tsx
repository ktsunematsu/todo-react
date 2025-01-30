import { useQuery } from '@tanstack/react-query'
import { getTodos } from '../api/todos'

function TodoList() {
  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>Todo一覧</h1>
      <ul>
        {todos?.map(todo => (
          <li key={todo.id}>
            {todo.text}
            {todo.alert && <span> ⚠️ </span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList