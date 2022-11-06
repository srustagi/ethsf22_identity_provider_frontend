import './App.css';
import Profile from './profile';
import Header from './Header';

function App() {
  return (
    <div>
      <Header />
      <div className='content'>
        <Profile />
      </div>
    </div>
  );
}

export default App;
