/**
 * 节流
 * @param fn 需要执行的函数
 * @param delay 间隔时间
 */
export const throttle = (fn, delay) => {
    let lastExecutionTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastExecutionTime >= delay) {
            fn(...args);
            lastExecutionTime = currentTime;
        }
    }
}