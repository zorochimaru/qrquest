import { RouteComponentProps } from '@reach/router'
import { useEffect } from 'react'
import { FC } from 'react'
import { useDispatch } from 'react-redux'
import { confirmEmail } from '../../../redux/Auth'

interface confIdProps extends RouteComponentProps {
    id?: string;
}
export const ConfirmationPage: FC<RouteComponentProps> = (props: confIdProps) => {
    const id = props.id!;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(confirmEmail(id))
    }, [dispatch, id])

    return (
        <div>
            <h1>Confirmation page</h1>
        </div>
    )
}
