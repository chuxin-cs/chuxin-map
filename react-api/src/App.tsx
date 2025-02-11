import {useState} from 'react'

import {UseStatePage} from "./hook-api/useState";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <h1>Vite + React {count}</h1>
            <button onClick={() => setCount(count + 1)}>点击+1</button>

            {/*  hooks api  */}
            <UseStatePage/>
        </>
    )
}

export default App
