
export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function removeTextBetweenParentheses(input: string):string {
    return input.replace(/\(.*?\)/g, '').trim();
}

export function removeAccents(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}