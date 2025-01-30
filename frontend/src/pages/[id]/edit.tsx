import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getTodoById } from '../../api/todos';

function TodoEdit() {
  const { id } = useParams();
  const { data: todo, isLoading } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => getTodoById(id as string),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!todo) return <div>Todo not found</div>;

  return (
    <div>
      <h1>Todo 詳細</h1>
      <div>
        <h2>{todo.text}</h2>
        <p>ステータス: {todo.completed ? '完了' : '未完了'}</p>
        {todo.alert && <p>⚠️ 重要</p>}
        <p>期限: {new Date(todo.limit_date).toLocaleString()}</p>
        <p>作成日: {new Date(todo.created_at).toLocaleString()}</p>
        <p>更新日: {new Date(todo.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default TodoEdit;