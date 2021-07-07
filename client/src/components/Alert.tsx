
import { Alert } from '@material-ui/lab';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Notification, uiActions } from '../redux/Ui';

const AlertComponent: FC<Notification> = (props: Notification) => {
    const dispatch = useDispatch();
    const closeAlert = () => {
        dispatch(
            uiActions.closeNotification(0)
        )
    }
    return (
        <Alert onClose={closeAlert}  severity={props.status}>{props.text}</Alert>
    )
}

export default AlertComponent;
