import { Typography } from "@material-ui/core"
import { RouteComponentProps } from "@reach/router"
 
import { FC } from "react"

const Page404: FC<RouteComponentProps> = () => {
    return (
        <div>
            <Typography variant="h3" gutterBottom>
                Page not found
            </Typography>
        </div>
    )
}

export default Page404
