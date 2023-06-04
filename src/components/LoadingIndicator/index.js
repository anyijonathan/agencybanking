import { RevolvingDot } from "react-loader-spinner"
import "./LoadingIndicator.scss"

const LoadingIndicator = () => {
    return (
        <div className="loading-indicator">
            <RevolvingDot color="#5C2682" height="100" width="100" />
        </div>
    )
}

export default LoadingIndicator