import { Paper, Button, TextField, Grid } from "@material-ui/core";
import { Link, RouteComponentProps } from "@reach/router";
import { FC, useRef } from "react";
import { useDispatch } from "react-redux"
import { resetPassword } from "../../../redux/Auth";

import classes from './NewPassword.module.css';

interface confIdProps extends RouteComponentProps {
    token?: string;
}
export const NewPasswordPage: FC<RouteComponentProps> = (props: confIdProps) => {
    const dispatch = useDispatch();
    const token = props.token!;
    const password = useRef<HTMLInputElement>(null);
    const rePassword = useRef<HTMLInputElement>(null);

    const handleResetPassword = () => {
        const regPass = password.current!.value;
        const reRegPass = rePassword.current!.value;
        dispatch(resetPassword(token, regPass, reRegPass));
    }


    return (
        <Grid
            container
            className={classes.wrapper}
            justify="center"
            alignItems="center"
        >
            <Paper className={classes.card} elevation={3} >
                <Grid
                    className={classes.wrapper}
                    spacing={3}
                    container
                    justify="center"
                    alignItems="center"
                >
                    <img src="/logo.png" alt="" />
                    
                    <TextField inputRef={password} id="pass" placeholder="password" required type="password" variant="outlined" />
                    <TextField inputRef={rePassword} id="rePass" placeholder="repeat password" required type="password" variant="outlined" />
                    <Grid container
                        justify="space-around" alignItems="center" >
                        <Button onClick={handleResetPassword} variant="contained" color="primary">
                            Send
                        </Button>
                    </Grid>

                </Grid>
            </Paper>
        </Grid>


    )
}
export default NewPasswordPage;