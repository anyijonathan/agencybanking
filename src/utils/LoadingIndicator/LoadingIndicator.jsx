import { RevolvingDot } from "react-loader-spinner"
import "./LoadingIndicator.scss"

const LoadingIndicator = () => {
    return (
        <div className="vw-100 vh-100">
            <div className="loading-indicator">
                <RevolvingDot color="#5C2682" />
            </div>
        </div>

    )
}

export default LoadingIndicator