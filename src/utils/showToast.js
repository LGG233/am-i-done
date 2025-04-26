import { toast } from 'react-toastify';
import { toastMessages } from './toastMessages';

export function showToast(type, key, options = {}) {
    const message = toastMessages[key] || key;
    const config = { autoClose: 3000, ...options };

    switch (type) {
        case 'success':
            toast.success(message, config);
            break;
        case 'error':
            toast.error(message, config);
            break;
        case 'info':
            toast.info(message, config);
            break;
        case 'warn':
            toast.warn(message, config);
            break;
        default:
            toast(message, config);
    }
}
