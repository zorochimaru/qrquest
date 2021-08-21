import React, { ReactNode, Suspense, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import ROLES from "../../models/roles.model";
import { RootState } from "../../redux/store"
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { Card, CardActionArea, Backdrop, CircularProgress, CardMedia, CardContent, makeStyles, Typography, createStyles, Theme } from "@material-ui/core";
import { Router } from "@reach/router";
const NewsController = React.lazy(() => import('./NewsController/NewsController'));

interface MenuItem {
    text: string,
    icon: ReactNode,
    link: string,
}
const ADMIN_MENU_ITEMS: MenuItem[] = [
    {
        text: 'News controller',
        icon: <BorderColorIcon />,
        link: '/news-control'
    },
]
const MODERATOR_MENU_ITEMS: MenuItem[] = [
    {
        text: 'News controller',
        icon: <BorderColorIcon />,
        link: '/news-control'
    },
]
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minWidth: 275,
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
        media: {
            height: 140,
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);
const ControlPage = () => {

    const user = useSelector((state: RootState) => state.auth.user);
    const [menuList, setMenuList] = useState<MenuItem[]>([]);
    const classes = useStyles();
    useEffect(() => {
        if (user?.role === ROLES.ADMIN) {
            setMenuList(ADMIN_MENU_ITEMS)
        }
        if (user?.role === ROLES.MODERATOR) {
            setMenuList(MODERATOR_MENU_ITEMS)
        }
    }, [user])
    return (
        <>
            {menuList.map(item => (
                <Card className={classes.root} key={item.text}>
                    <CardActionArea>

                        <CardMedia
                            className={classes.media}
                            children={item.icon}
                        />
                        <CardContent>

                            <Typography variant="h5" component="h2">
                                {item.text}
                            </Typography>


                        </CardContent>

                    </CardActionArea>
                </Card>
            ))
            }
            <Suspense fallback={
                <Backdrop className={classes.backdrop} open={true} >
                    <CircularProgress color="inherit" />
                </Backdrop>}>
                <Router>
                    <NewsController path="news-controller/:id" />
                </Router>
            </Suspense>
        </>
    )
}

export default ControlPage
