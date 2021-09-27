import { FC } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import ROLES from "../../models/roles.model";
import { RootState } from "../../redux/store"
import { Card, CardActionArea, CardContent, Typography, Theme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { navigate, RouteComponentProps, useLocation } from "@reach/router";


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
    {
        text: 'Question controller',
        link: '/question-control',
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

                    <Card style={{marginBottom: 20}} onClick={() => handleClick(item.link)} className={classes.root} key={item.text}>
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
