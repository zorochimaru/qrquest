import { Redirect } from "@reach/router";
 


export const PrivateRoute = (props: any) => {
    const accessToken = sessionStorage.getItem('accessToken');
    let { as: Comp, ...otherProps } = props;

    return accessToken ? (
        <Comp {...otherProps} />
    ) : (
        <Redirect to="/login" replace={true} noThrow={true} />
    );
};