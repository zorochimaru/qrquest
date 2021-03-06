import { Divider, Drawer, IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { navigate } from '@reach/router';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import { ReactComponentElement, useEffect, useState } from 'react';
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
            setMenu(prev => [
                {
                    text: 'Control panel',
                    icon: <AssignmentIcon />,
                    action: () => {
                        navigate('/control-panel')
                    },
                },
                 ...prev])

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
                <IconButton onClick={props.handleDrawerClose} size="large">
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
    );
}

export default Sidebar
