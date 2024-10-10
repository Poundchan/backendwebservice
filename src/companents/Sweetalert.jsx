// AlertService.js
import Swal from 'sweetalert2';

const AlertService = {
    confirm: async (title, text) => {
        const result = await Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        });
        return result.isConfirmed;
    },
    success: (title, text) => {
        Swal.fire(
            title,
            text,
            'success'
        );
    },
    error: (title, text) => {
        Swal.fire(
            title,
            text,
            'error'
        );
    }
};

export default AlertService;
