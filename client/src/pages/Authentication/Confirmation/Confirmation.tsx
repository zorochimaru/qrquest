import { RouteComponentProps } from '@reach/router'
import { useEffect } from 'react'
import { FC } from 'react'
import { useDispatch } from 'react-redux'
import { confirmEmail } from '../../../redux/Auth'

interface confIdProps extends RouteComponentProps {
    token?: string;
}
export const ConfirmationPage: FC<RouteComponentProps> = (props: confIdProps) => {

    const token = props.token;
    const dispatch = useDispatch();
    useEffect(() => {
        if (token) {
            dispatch(confirmEmail(token))
        }
    }, [dispatch, token])

    return (
        <div style={{height: '100vh', width: '100%', display: 'grid', placeItems: 'center'}}>
           Confirmation in process
        </div>
    )
}
