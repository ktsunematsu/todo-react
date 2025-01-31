import axios from 'axios';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  alert: boolean;
  limit_date: string;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  text: string;
  completed?: boolean;
  alert?: boolean;
  limit_date?: string;
}

interface TodoUpdate {
  text?: string;
  completed?: boolean;
  alert?: boolean;
  limit_date?: string;
}

export const getTodos = async (): Promise<Todo[]> => {
  try {
    console.log('Fetching todos...');
    const response = await axios.get('http://localhost:8000/api/todos', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response:', response);
    console.log('Fetched todos:', response.data); // データのみのログ
    return response.data;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const getTodoById = async (id: string): Promise<Todo> => {
  const { data } = await axios.get(`http://localhost:8000/api/todos/${id}`);
  return data;
};

export const createTodo = async (todo: TodoCreate): Promise<Todo> => {
  const { data } = await axios.post('http://localhost:8000/api/todos', todo);
  return data;
};

export const updateTodo = async (id: number, updates: Partial<TodoUpdate>): Promise<Todo> => {
  const { data } = await axios.put(`http://localhost:8000/api/todos/${id}`, updates);
  return data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`http://localhost:8000/api/todos/${id}`);
};
