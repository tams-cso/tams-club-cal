function getId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

export { getId };
