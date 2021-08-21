import { Toolbar, IconButton, Menu, MenuItem, AppBar, Typography } from "@material-ui/core"
import { AccountCircle } from "@material-ui/icons"
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";
import { logOut } from "../redux/Auth";
import clsx from 'clsx';
import { navigate } from "@reach/router";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

const Header = (props: any) => {
    const classes = useStyles();
    const user = useSelector((state: RootState) => state.auth.user);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openAccountContextMenu = Boolean(anchorEl);
    const dispatch = useDispatch();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        dispatch(logOut());
    };

    const handleLogin = () => {
        navigate('/login');
    };
    return (

        <AppBar
            position="fixed"
            className={clsx(props.classes.appBar, {
                [props.classes.appBarShift]: props.openSidebar,
            })}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.handleDrawerOpen}
                    className={clsx(props.classes.menuButton, props.openSidebar && props.classes.hide)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap className={classes.title}>
                    {document.title}
                </Typography>

                <div>
                    {user ? <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton> : <IconButton  color="inherit" onClick={handleLogin}>  <ExitToAppIcon /> </IconButton>}

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={openAccountContextMenu}
                        onClose={handleClose}
                    >

                        < MenuItem onClick={handleLogout}>LogOut</MenuItem>

                    </Menu>
                </div>
            </Toolbar>
        </AppBar >

     )
}

export default Header
