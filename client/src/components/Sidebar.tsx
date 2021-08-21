import { Divider, Drawer, IconButton, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { navigate } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logOut } from '../redux/Auth';
import { ReactComponentElement, useCallback, useEffect, useState } from 'react';
import ROLES from '../models/roles.model';


interface MenuItem {
    text: string,
    icon: ReactComponentElement<any>,
    action: any,
    hasDivider?: boolean
}
const menuItems: MenuItem[] = [
    {
        text: 'News',
        icon: <AssignmentIcon />,
        action: () => { navigate('/') },
    },
]
const Sidebar = (props: any) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [menu, setMenu] = useState(menuItems);

    useEffect(() => {

        setMenu(menuItems);
        if (user && (user?.role === ROLES.ADMIN || user?.role === ROLES.MODERATOR)) {
            setMenu(prev => [{
                text: 'Control panel',
                icon: <AssignmentIcon />,
                action: () => { navigate('/control-panel') },
            }, ...prev])

        }
    }, [user])
    return (
        <Drawer
            className={props.classes.drawer}
            variant="persistent"
            anchor="left"
            open={props.openSidebar}
            classes={{
                paper: props.classes.drawerPaper,
            }}
        >
            <div className={props.classes.drawerHeader}>
                <img style={{ width: '50%', margin: '0 auto' }} src="/logo.png" alt="" />
                <IconButton onClick={props.handleDrawerClose}>
                    {props.theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            {menu.map(item => (

                <div key={item.text}>
                    {item.hasDivider ? <Divider /> : null}
                    <ListItem onClick={item.action} button>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                </div>

            ))
            }
        </Drawer >
    )
}

export default Sidebar
