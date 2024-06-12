function hide_all_modals() {
        let modals_class = document.querySelector('.modal-backdrop.fade.show');
        if (modals_class)
            modals_class.remove();
    }