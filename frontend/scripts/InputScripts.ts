export function inputMode (mode: string)
{
    const inputs = document.querySelectorAll<HTMLInputElement>('input');
    const buttonAdd = document.querySelector<HTMLButtonElement>('#buttonAdd');

    inputs.forEach(input => {
        if (mode == 'V') {
            input.disabled = true;
            if (buttonAdd) buttonAdd.style.display = 'none';
        }
        else if (mode == 'M') {
            input.disabled = false;
        }
        else if (mode == 'C') {
            input.disabled = false;
        }
    });
}