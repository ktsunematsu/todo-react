import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTodos } from '../api/todos';

export default function TodoList() {
  const navigate = useNavigate();
  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="todo-list">
      <div className="header">
        <h1>Todo一覧</h1>
        <button onClick={() => navigate('/create')} className="create-button">
          新規作成
        </button>
      </div>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            <span>{todo.text}</span>
            {todo.alert && <span role="img" aria-label="alert">⚠️</span>}
            <button onClick={() => navigate(`/${todo.id}`)}>
              詳細
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}