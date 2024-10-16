document.getElementById('contact-form')?.addEventListener('submit', function(e: SubmitEvent) {
    e.preventDefault();

    const self = this as HTMLFormElement;
    const form = new FormData(self);
    const formObj: any = {};

    form.forEach((v, k) => {
        formObj[k] = v;
    });
    const urlEncoded = new URLSearchParams(formObj);

    fetch(self.action, {
        method: self.method,
        body: urlEncoded,
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Invalid submission.');
        }

        self.reset();
    })
    .catch(e => {
        console.error(e);
    });
});
