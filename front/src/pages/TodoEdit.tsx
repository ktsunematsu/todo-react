import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getTodoById, updateTodo } from '../api/todos';
import { useEffect } from 'react';

// 1ヶ月後の日付を取得
const getOneMonthLater = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 16);
};

// 現在日時を取得
const getCurrentDateTime = () => {
  return new Date().toISOString().slice(0, 16);
};

const schema = yup.object({
  text: yup
    .string()
    .required('内容は必須です')
    .min(1, '内容を入力してください')
    .max(100, '内容は100文字以内で入力してください'),
  alert: yup.boolean(),
  limit_date: yup.string().nullable()
}).required();

type FormInputs = {
  text: string;
  alert: boolean;
  limit_date: string;
};

function TodoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: todo, isLoading } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => getTodoById(id as string),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: yupResolver(schema)
  });

  const alert = watch('alert');

  useEffect(() => {
    if (todo) {
      setValue('text', todo.text);
      setValue('alert', todo.alert);
      setValue('limit_date', todo.limit_date || '');
    }
  }, [todo, setValue]);

  const updateMutation = useMutation({
    mutationFn: (data: FormInputs) => updateTodo(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      navigate('/');
    },
  });

  const onSubmit = (data: FormInputs) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Todo編集</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            内容:
            <input {...register('text')} type="text" />
          </label>
          {errors.text && <p style={{ color: 'red' }}>{errors.text.message}</p>}
        </div>
        <div>
          <label>
            アラート:
            <input {...register('alert')} type="checkbox" />
          </label>
        </div>
        {alert && (
          <div>
            <label>
              期限:
              <input 
                {...register('limit_date')} 
                type="datetime-local"
                min={getCurrentDateTime()}
                max={getOneMonthLater()} 
                required={alert}
              />
            </label>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button type="button" onClick={() => navigate('/')}>キャンセル</button>
          <button type="submit">更新</button>
        </div>
      </form>
    </div>
  );
}

export default TodoEdit;