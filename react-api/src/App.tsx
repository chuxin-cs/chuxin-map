import {useState} from 'react'
import Layout from "./Layout"

import {UseStatePage} from "./hook-api/useState";
import {UseEffectPage} from "./hook-api/useEffect";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Layout>

            </Layout>

            <h1>Vite + React {count}</h1>
            <button onClick={() => setCount(count + 1)}>点击+1</button>
            {/*  hooks api  */}
            <UseStatePage/>
            <UseEffectPage/>
        </>
    )
}

export default App
