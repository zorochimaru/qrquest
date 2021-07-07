import { Redirect } from "@reach/router";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


export const PrivateRoute = (props: any) => {
    const isLoged = useSelector((state: RootState ) => state.auth.isLoged);
    let { as: Comp, ...otherProps } = props;

    return isLoged ? (
        <Comp {...otherProps} />
    ) : (
        <Redirect to="/login" replace={true} noThrow={true} />
    );
};