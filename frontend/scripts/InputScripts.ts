export function inputMode (mode: string)
{
    const inputs = document.querySelectorAll<HTMLInputElement>('input');
    const buttonAdd = document.querySelector<HTMLButtonElement>('#buttonAdd');
    
    if (mode == 'V' && buttonAdd) buttonAdd.style.display = 'none';
    
    inputs.forEach(input => {
        if (mode == 'V') {
            input.disabled = true;
            input.style.border = 'transparent';
            input.style.paddingLeft = '0';
            input.style.paddingRight = '0';
        }
        else if (mode == 'M') {
            input.disabled = false;
        }
        else if (mode == 'C') {
            input.disabled = false;
        }
    });
}