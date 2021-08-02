import { RouteComponentProps } from '@reach/router'
import { FC, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { test } from '../../redux/Auth'
import { RootState } from '../../redux/store'


export const HomePage: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user)
    
    useEffect(() => {
        
        dispatch(test());
    
    }, [dispatch])
    const handle = () => {
        dispatch(test());
    }
    return (
        <div>
            {/* добавить ленту новостей о будущих и активных квестах */}
            <h1>Home page</h1>
            <p>Hi!, {user?.name}</p>
            <button onClick={handle}>Click</button>
        </div>
    )
}
