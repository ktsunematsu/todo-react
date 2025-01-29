import { useState, useEffect } from 'react';
import axios from 'axios';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5173');
        setTodos(response.data);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div>
      <h1>TODO List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text} - {todo.completed ? 'Completed' : 'Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
