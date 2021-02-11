import { useState, useEffect } from 'react';
import { Alert } from 'reactstrap';

const Info = (props) => {
    const [isVisible, setClose] = useState(true);
    const color = props.isSuccess ? 'success' : 'danger';

    useEffect(() => {
        if (isVisible) {
            window.setTimeout(() => {
                setClose(!isVisible);
                props.set("");
            }, 5000);
        }
    }, []);
    
    return (
        <div>
            <Alert isOpen={isVisible} color={color}>{props.message}</Alert>
        </div>
    )
}
export default Info;