import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, Link } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <nav>
          <Link to="/">Todo一覧</Link> | 
          <Link to="/create">新規作成</Link>
        </nav>
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}

export default App;
