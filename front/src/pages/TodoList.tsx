import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, updateTodo } from '../api/todos';

// 期限切れチェック
const isOverdue = (limitDate: string | null) => {
  if (!limitDate) return false;
  return new Date(limitDate) < new Date();
};

export default function TodoList() {
  const [showCompleted, setShowCompleted] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      updateTodo(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const sortedTodos = todos?.sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  const activeTodos = sortedTodos?.filter(todo => !todo.completed) || [];
  const completedTodos = sortedTodos?.filter(todo => todo.completed) || [];

  return (
    <div className="todo-list">
      <div className="header">
        <h1>マイタスク</h1>
      </div>
      
      <ul>
        <li className="create-todo-item">
          <input type="checkbox" checked={true} disabled />
          <span 
            className="clickable-text"
            onClick={() => navigate('/create')}
          >
            タスクを追加
          </span>
        </li>
        {activeTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => 
                updateMutation.mutate({
                  id: todo.id,
                  completed: !todo.completed,
                })
              }
            />
            <span style={{ 
              color: (!todo.completed && isOverdue(todo.limit_date)) ? 'red' : 'inherit' 
            }}>
              {todo.text}
            </span>
            {((!todo.completed && isOverdue(todo.limit_date))) && (
              <span 
                className="material-symbols-outlined" 
                role="img" 
                aria-label="alert"
                style={{ color: isOverdue(todo.limit_date) ? 'red' : '#5f6368' }}
              >
                warning
              </span>
            )}
            <button onClick={() => navigate(`/${todo.id}`)}>
              詳細
            </button>
          </li>
        ))}
      </ul>

      <div className="completed-section">
        <button 
          className="toggle-completed"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          完了済み ({completedTodos.length})
          <span>{showCompleted ? '▼' : '▶'}</span>
        </button>
        
        {showCompleted && (
          <ul>
            {completedTodos.map((todo) => (
              <li key={todo.id} className="completed">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => updateMutation.mutate({
                    id: todo.id,
                    completed: !todo.completed,
                  })}
                />
                <span>{todo.text}</span>
                
                <button onClick={() => navigate(`/${todo.id}`)}>詳細</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}