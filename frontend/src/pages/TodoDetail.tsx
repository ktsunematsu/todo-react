import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { getTodoById } from '../api/todos'

function formatDateTime(dateString: string | undefined) {
  if (!dateString) return '未設定';
  return new Date(dateString).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function TodoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: todo, isLoading } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => getTodoById(id as string)
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>Todo詳細</h1>
      <div>
        <p>ID: {id}</p>
        <p>内容: {todo?.text}</p>
        <p>完了: {todo?.completed ? '完了' : '未完了'}</p>
        <p>アラート: {todo?.alert ? 'あり' : 'なし'}</p>
        <p>期限: {formatDateTime(todo?.limit_date)}</p>
        <p>作成日時: {formatDateTime(todo?.created_at)}</p>
        <p>更新日時: {formatDateTime(todo?.updated_at)}</p>
      </div>
      <button onClick={() => navigate('/')}>戻る</button>
    </div>
  )
}

export default TodoDetail
