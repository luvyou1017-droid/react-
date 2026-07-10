import ProfileForm from './components/ProfileForm'
import './App.css'

function App() {
  return (
    <main>
      <ProfileForm
        onSubmit={(data) => {
          console.log('submitted profile', data)
        }}
      />
    </main>
  )
}

export default App
