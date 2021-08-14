import { Paper, Button, TextField, Grid } from "@material-ui/core";
import { Link, RouteComponentProps } from "@reach/router";
import { FC, useRef } from "react";
import { useDispatch } from "react-redux"
import { sendResetPasswordEmail } from "../../../redux/Auth";
import classes from './Reset.module.css';

const ResetPage: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const email = useRef<HTMLInputElement>(null);
  
    const handleReset = () => {
        const regEmail = email.current!.value;
        dispatch(sendResetPasswordEmail(regEmail));
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
                    <TextField inputRef={email} id="email" placeholder="email" variant="outlined" />
                    <Grid container
                        justify="space-around" alignItems="center" >
                        <Button onClick={handleReset} variant="contained" color="primary">
                            Change password
                        </Button>
                    </Grid>

                </Grid>
            </Paper>
        </Grid>


    )
}
export default ResetPage;