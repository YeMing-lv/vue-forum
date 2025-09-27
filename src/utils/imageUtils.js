export function getImagePathFromHTML(html) {
    // 正则表达式匹配 img 标签的 src 属性
    const pattern = /<img\s+[^>]*?src\s*=\s*["']([^"']*)["'][^>]*?>/gi;
    let match;
    const urls = [];

    while ((match = pattern.exec(html)) !== null) {
        urls.push(match[1]);
    }
    return urls;
}

// 提取URL的 相对路径
export function extractImagePath(originalUrl) {
    const urlParts = originalUrl.split('/');
    let extractedPart = "";
    if (urlParts.length > 4) {
        extractedPart = `${urlParts[4]}/${urlParts[5]}`;
    } else {
        extractedPart = 'Invalid URL';
    }
    return extractedPart;
}