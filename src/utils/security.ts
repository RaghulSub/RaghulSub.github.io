

export const escapeHTML = (text: string | null | undefined) : string => {
    if (text == null) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}


export const isSafeURL = (url: string | null | undefined, allowedProtocols: string[] = ["http:", "https:", "mailto:"]) : boolean => {
    if (!url) return false;
    if (!url.includes('://') && !url.startsWith('#')) return true;
    try {
        const parsedUrl = new URL(url);
        return allowedProtocols.includes(parsedUrl.protocol);
    } catch ( error ) {
        console.error(`Invalid URL: ${url}`, error);
        return false;
    }
}

export const sanitizeURL = (url : string | null | undefined, fallbackURL : string = "#") : string => {
    if (url && isSafeURL(url)) {
        return url;
    }
    const sanitizedFallbackURL = isSafeURL(fallbackURL) ? fallbackURL : "#";
    return sanitizedFallbackURL;
}



