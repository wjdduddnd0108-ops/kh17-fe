// utils/sanitizeHtml.js
import DOMPurify from "dompurify";

/**
 * React에 출력할 HTML에서 위험 요소를 제거합니다.
 *
 * @param {unknown} html 원본 HTML
 * @returns {string} 정화된 HTML
 */
export function purifyHtml(html) {
    if (typeof html !== "string") {
        return "";
    }

    return DOMPurify.sanitize(html, {
        // SVG, MathML은 허용하지 않고 HTML만 처리
        USE_PROFILES: {
            html: true,
        },

        // 필요하지 않거나 보안상 위험할 수 있는 태그
        FORBID_TAGS: [
            "script",
            "iframe",
            "object",
            "embed",
            "applet",
            "base",
            "meta",
            "link",
            "style",
            "form",
            "input",
            "button",
            "textarea",
            "select",
            "option",
        ],

        // 태그와 별도로 차단할 속성
        FORBID_ATTR: [
            "srcdoc",
            "formaction",
            "xmlns",
        ],

        // data-* 속성 제거
        ALLOW_DATA_ATTR: false,

        // aria-* 속성은 유지
        ALLOW_ARIA_ATTR: true,

        // id, name을 이용한 DOM Clobbering 방어
        SANITIZE_DOM: true,
        SANITIZE_NAMED_PROPS: true,

        // 금지 태그 내부의 일반 텍스트는 유지
        KEEP_CONTENT: true,
    });
}