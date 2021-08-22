import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { RootState } from '../redux/store';
import { uiActions } from '../redux/Ui';

let displayed: any[] = [];

const Notifier = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state: RootState) => state.ui.notifications);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const storeDisplayed = (id: number | string) => {
        displayed = [...displayed, id];
    };

    const removeDisplayed = (id: number | string) => {
        displayed = [...displayed.filter(key => id !== key)];
    };

    useEffect(() => {
        notifications.forEach(({ key, message, options = {}, dismissed = false }) => {
            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key!);
                return;
            }

            // do nothing if snackbar is already displayed
            if (displayed.includes(key)) return;
            
            // display snackbar using notistack
            enqueueSnackbar(message, {
                key,
                ...options,
                onClose: (event, reason, myKey) => {
                    if (options.onClose) {
                        options.onClose(event, reason, myKey);
                    }
                },
                onExited: (_event, myKey) => {
                    // remove this snackbar from redux store
                    dispatch(uiActions.removeNotification(myKey));
                    removeDisplayed(myKey);
                },
            });

            // keep track of snackbars that we've displayed
            storeDisplayed(key!);
        });
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

    return null;
};

export default Notifier;