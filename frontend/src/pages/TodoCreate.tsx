import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createTodo } from '../api/todos';

function TodoCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const [alert, setAlert] = useState(false);
  const [limitDate, setLimitDate] = useState('');

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      navigate('/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      text,
      completed: false,
      alert,
      limit_date: limitDate || undefined
    });
  };

  return (
    <div>
      <h1>新規Todo作成</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            内容:
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            アラート:
            <input
              type="checkbox"
              checked={alert}
              onChange={(e) => setAlert(e.target.checked)}
            />
          </label>
        </div>
        {alert && (
          <div>
            <label>
              期限:
              <input
                type="datetime-local"
                value={limitDate}
                onChange={(e) => setLimitDate(e.target.value)}
                required={alert}
              />
            </label>
          </div>
        )}
        <div className="button-group">
          <button type="button" onClick={() => navigate('/')}>
            戻る
          </button>
          <button type="submit" disabled={createMutation.isPending} className="primary-button">
            {createMutation.isPending ? '作成中...' : '作成'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TodoCreate;