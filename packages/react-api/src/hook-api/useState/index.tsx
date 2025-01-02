import {useState} from "react";
import {produce} from 'immer';

/**
 * 由于是学习react阶段 useState api 代码都在当前文件中，不做文件拆分，影响
 * 1、Base: useState 基础用法
 * 2、Mind: useState 设计带来的心智问题
 * 3、MindImmer: useState 心智问题解决方案 immer
 *
 * */
export function UseStatePage() {
    return (
        <div>
            <h1>1、useState</h1>
            {/*  useState 基础用法  */}
            <Base/>
            {/*  useState 设计带来的心智问题  */}
            <Mind/>
            {/*  useState 心智问题解决方案 immer  */}
            <MindImmer/>
        </div>
    )
}

// 1、useState 基础用法
function Base() {
    const [state, setState] = useState(0)

    // data 其实就是当前的 state  如果当前 updateState 被拆分到另外一个文件中 data 就显得无比重要
    const updateState = (data: number) => {
        // return state - 1;
        return data - 1;
    }

    return (
        <div>
            <div>state:{state}</div>
            {/* 直接调用 setState 传入值 state 进行更新 */}
            <button onClick={() => setState(state + 1)}>state + 1</button>
            {/*  setstate 可以通过传入函数进行更新  */}
            <button onClick={() => setState(updateState)}>state - 1</button>
        </div>
    )
}


interface ItProps {
    nickName: string;
    web: Array<string>;
    Java: Array<string>;
}

interface UseStatePageProps {
    name: string;
    age: number;
    it?: ItProps
}

// 2、useState 设计带来的心智问题
function Mind() {
    const [state, setState] = useState<UseStatePageProps>({name: "初心", age: 28});

    // 修改 name
    const updateStateName = () => {
        // 设计接收的是返回之后的最新值  所以这里在针对引用类型会出现 【1、{...}  2、Object.assign 3、直接访问对象赋值，】等等 后面再写其他方法 简单的就这些
        setState((data) => {
            // 1、这里 data 需要返回为一个新的引用地址数据才会更新 这里特意用 JSON.parse JSON.stringify 就是提醒以后的自己 这里需要返回新的引用
            // data.name = 'chuxin'
            // return JSON.parse(JSON.stringify(data));

            // 2、所以为了代码美观 我们使用了 Object.assign
            // return Object.assign({}, data, {name: "chuxin"})

            // 3、Object.assign 单词太难打了 我还是喜欢 ... 所以后面就都用这种
            return {...data, name: "chuxin"}

            // 这里一定要一个新引用 就会带出一些问题 比如对象中的对象 那么需要特殊处理 用第二个例子来研究
        });
    }

    // 添加一个 对象属性 it
    const addStateToIt = () => {
        setState((data) => {
            return {
                ...data,
                it: {
                    nickName: "云层上的光",
                    web: ['Vue', 'React', 'JavaScript', 'TypeScript'],
                    Java: ['Spring', 'Spring Boot', 'Spring Cloud']
                }
            }
        })
    }

    // 修改
    const updateStateIt = () => {
        setState((data) => {
            // 第一种
            // return {
            //     ...data,
            //     it: {
            //         ...data.it,
            //         nickName: "初心",
            //         age: 28
            //     }
            // }

            // 第二种
            // 这样的话 最终需要把 data 引用改成新的引用
            // const list = data.it.web;
            // list.push("Nest")
            // console.log(list)
            // data.it.web = [...list]
            // return {...data};

            // 第三种：通过这种方式
            data.it?.web.push("Nest")
            return {...data};

            // 一般项目中的数据层级比较深
            // 得出结论：React 不关心数据是怎么样的
        })
    }

    return (
        <div>
            <div>userInfo: {JSON.stringify(state)}</div>
            <button onClick={() => updateStateName()}>修改name</button>
            <button onClick={() => addStateToIt()}>添加 it 对象属性</button>
            <button onClick={() => updateStateIt()}>修改 it 对象属性</button>
        </div>
    )
}

// 3、useState 心智问题解决方案 immer => useImmer
function MindImmer() {
    const [state, setState] = useState<UseStatePageProps>({name: "初心", age: 28});
    const updateStateName = () => {
        setState(produce((data) => {
            data.name = 'chuxin'
        }))
    }
    const addStateToIt = () => {
        setState(produce((data) => {
            data.it = {
                nickName: "云层上的光",
                web: ['Vue', 'React', 'JavaScript', 'TypeScript'],
                Java: ['Spring', 'Spring Boot', 'Spring Cloud']
            }
        }))
    }
    const updateStateIt = () => {
        // 切记：这个是累加操作
        setState(produce((data) => {
            data.it?.web.push("Nest")
            data.it?.Java.splice(0, 1)
        }))
    }
    return (
        <div>
            <div>userInfo: {JSON.stringify(state)}</div>
            <button onClick={() => updateStateName()}>immer方式：修改name</button>
            <button onClick={() => addStateToIt()}>immer方式：添加 it 对象属性</button>
            <button onClick={() => updateStateIt()}>immer方式：修改 it 对象属性</button>
        </div>
    )
}

