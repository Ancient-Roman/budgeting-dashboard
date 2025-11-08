export function getEmojiForCategory(cat?: string) {
    if (!cat) return '🗂️';
    const c = cat.toLowerCase();
    if (c.includes('travel') || c.includes('air') || c.includes('flight') || c.includes('hotel')) return '✈️';
    if (c.includes('grocery') || c.includes('groceries') || c.includes('supermarket') || c.includes('food')) return '🛒';
    if (c.includes('dining') || c.includes('restaurant') || c.includes('cafe') || c.includes('eat')) return '🍽️';
    if (c.includes('rent') || c.includes('mortgage') || c.includes('housing')) return '🏠';
    if (c.includes('utility') || c.includes('electric') || c.includes('water') || c.includes('gas bill')) return '💡';
    if (c.includes('transport') || c.includes('uber') || c.includes('lyft') || c.includes('taxi') || c.includes('bus')) return '🚗';
    if (c.includes('fuel') || c.includes('gas')) return '⛽';
    if (c.includes('entertain') || c.includes('movie') || c.includes('concert') || c.includes('games')) return '🎭';
    if (c.includes('health') || c.includes('medical') || c.includes('pharmacy') || c.includes('doctor')) return '💊';
    if (c.includes('insurance')) return '🛡️';
    if (c.includes('education') || c.includes('tuition')) return '🎓';
    if (c.includes('shopping') || c.includes('clothes') || c.includes('amazon')) return '🛍️';
    if (c.includes('subscription') || c.includes('netflix') || c.includes('spotify')) return '🔁';
    if (c.includes('uncategor') || c.includes('other')) return '🗃️';
    return '📁';
}

export default getEmojiForCategory;
