import React, { FC, Suspense, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import ROLES from "../../models/roles.model";
import { RootState } from "../../redux/store"
import { Card, CardActionArea, Backdrop, CircularProgress, CardContent, makeStyles, Typography, createStyles, Theme } from "@material-ui/core";
import { Link, Location, navigate, Redirect, RouteComponentProps, Router, useLocation } from "@reach/router";
const NewsController = React.lazy(() => import('./NewsController/NewsController'));

interface MenuItem {
    text: string,
    link: string,
    roles: ROLES[],
}
const MENU_ITEMS: MenuItem[] = [
    {
        text: 'News controller',
        link: '/news-control',
        roles: [ROLES.ADMIN, ROLES.MODERATOR]
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
const ControlPage: FC<RouteComponentProps> = (props) => {

    const user = useSelector((state: RootState) => state.auth.user);
    const [menuList] = useState<MenuItem[]>(MENU_ITEMS);
    const classes = useStyles();
    const location = useLocation();

    const handleClick = (link: string) => {
        navigate(location.pathname + link);
    }

    return (
        <>

            {menuList.map(item => (
                user && item.roles.includes(user.role) ?

                    <Card onClick={() => handleClick(item.link)} className={classes.root} key={item.text}>
                        <CardActionArea>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {item.text}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    : null
            ))
            }
         
        </>
    )
}

export default ControlPage
